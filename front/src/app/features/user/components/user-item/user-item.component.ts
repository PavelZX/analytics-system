import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { remove } from 'lodash';
import { take, tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { updateItem } from '../../../../shared/utils/upsert-item';
import { User } from '../../../auth/service/auth.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
})
export class UserItemComponent {
  @Input() user: User;
  @Input() publicUsers: User[] = [];

  loading = false;

  constructor(
    private userService: UserService,
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

    this.userService
      .deleteUser(this.user)
      .pipe(take(1))
      .subscribe(() => {
        this.loading = false;

        remove(this.publicUsers, r => r._id === this.user._id);
      });
  }

  joinUser() {
    this.loading = true;

    const process = () => (this.loading = false);

    this.userService
      .getUser(this.user._id)
      .pipe(take(1), tap(process, process))
      .subscribe(() => this.router.navigate(['/user', this.user._id]));
  }

  confirmLeaveUser() {
    const dialog = this.dialog.open(ConfirmDialogComponent);

    dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe(confirm => {
        if (confirm) {
          this.leaveUser();
        }
      });
  }

  leaveUser() {
    this.loading = true;

    const process = () => (this.loading = false);

    this.userService
      .leaveUser(this.user._id)
      .pipe(take(1), tap(process, process))
  }

  copyUrl() {
    this.clipboard.copy(`${window.location.origin}/user/${this.user._id}`);
  }

  isString<T>(value: T) {
    return typeof value === 'string';
  }
}
