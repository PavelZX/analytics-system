import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { remove } from 'lodash';
import { forkJoin, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { updateItem } from '../../../../shared/utils/upsert-item';
import { AuthService, User } from '../../../auth/service/auth.service';
import {
  ActionType,
  OrganizationDialogComponent,
} from '../../components/organization-dialog/organization-dialog.component';
import { Organization, OrganizationService } from '../../service/organization.service';

@Component({
  templateUrl: './organizations-page.component.html',
  styleUrls: ['./organizations-page.component.scss'],
})
export class OrganizationsPageComponent implements OnInit, OnDestroy {
  activeOrganizations: Organization[] = [];
  allOrganizations: Organization[] = [];
  memberOrganizations: Organization[] = [];
  user: User;

  loading = false;

  destroy$ = new Subject();

  constructor(
    private organizationService: OrganizationService,
    private dialog: MatDialog,
    private authService: AuthService,
    private clipboard: Clipboard,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loading = true;

    const process = () => (this.loading = false);

    forkJoin({
      activeOrganizations: this.organizationService.getActiveOrganizations().pipe(take(1)),
      allOrganizations: this.organizationService.getOrganizations().pipe(take(1)),
    })
      .pipe(tap(process, process))
      .subscribe(({ activeOrganizations, allOrganizations }) => {
        this.activeOrganizations = activeOrganizations;
        this.allOrganizations = allOrganizations;
      });

    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => (this.user = user));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openCreateDialog() {
    const dialog = this.dialog.open(OrganizationDialogComponent, {
      data: {
        type: ActionType.Create,
      },
    });
  }
}
