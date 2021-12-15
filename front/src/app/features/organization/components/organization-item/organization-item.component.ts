import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { remove } from 'lodash';
import { take, tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { updateItem } from '../../../../shared/utils/upsert-item';
import { User } from '../../../auth/service/auth.service';
import { Organization, OrganizationService } from '../../service/organization.service';

@Component({
  selector: 'app-organization-item',
  templateUrl: './organization-item.component.html',
  styleUrls: ['./organization-item.component.scss'],
})
export class OrganizationItemComponent {
  @Input() organization: Organization;
  @Input() activeOrganizations: Organization[] = [];
  @Input() memberOrganizations: Organization[] = [];

  loading = false;

  constructor(
    private organizationService: OrganizationService,
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private router: Router,
  ) {}

  confirmDelete() {
    const dialog = this.dialog.open(ConfirmDialogComponent);

    dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe(confirm => {
        if (confirm) {
          this.delete();
        }
      });
  }

  delete() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.organizationService
      .deleteOrganization(this.organization)
      .pipe(take(1))
      .subscribe(() => {
        this.loading = false;

        remove(this.activeOrganizations, r => r._id === this.organization._id);
        remove(this.memberOrganizations, r => r._id === this.organization._id);
      });
  }

  openOrganization() {
    this.loading = true;

    const process = () => (this.loading = false);

    this.organizationService
      .getOrganization(this.organization._id)
      .pipe(take(1), tap(process, process))
      .subscribe(() => this.router.navigate(['/organization', this.organization._id]));
  }

  isString<T>(value: T) {
    return typeof value === 'string';
  }
}
