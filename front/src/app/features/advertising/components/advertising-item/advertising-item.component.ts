import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { remove } from 'lodash';
import { take, tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { updateItem } from '../../../../shared/utils/upsert-item';
import { Advertising, AdvertisingService } from '../../service/advertising.service';

@Component({
  selector: 'app-advertising-item',
  templateUrl: './advertising-item.component.html',
  styleUrls: ['./advertising-item.component.scss'],
})
export class AdvertisingItemComponent {
  @Input() advertising: Advertising;
  @Input() activeAdvertisings: Advertising[] = [];

  loading = false;

  constructor(
    private advertisingService: AdvertisingService,
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

    this.advertisingService
      .deleteAdvertising(this.advertising)
      .pipe(take(1))
      .subscribe(() => {
        this.loading = false;

        remove(this.activeAdvertisings, r => r._id === this.advertising._id);
        });
  }

  openAdvertising() {
    this.loading = true;

    const process = () => (this.loading = false);

    this.advertisingService
      .getAdvertising(this.advertising._id)
      .pipe(take(1), tap(process, process))
      .subscribe(() => this.router.navigate(['/advertising', this.advertising._id]));
  }

  isString<T>(value: T) {
    return typeof value === 'string';
  }
}
