import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/features/auth/service/auth.service';
import {
  UpdatePasswordBody,
  UserService,
} from 'src/app/features/user/service/user.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent implements OnInit {
  settingsForm = this.formBuilder.group({
    firstName: '',
    mobileNumber: '',
    email: '',
    currentPassword: null,
    password: null,
    confirmPassword: null,
  });

  loading = false;

  get user() {
    return this.authService.user;
  }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    const { firstName, mobileNumber, email } = this.authService.user;

    this.settingsForm.patchValue({
      firstName,
      mobileNumber,
      email,
    });
  }

  updateUsername() {
    const { firstName } = this.settingsForm.value;

    if (this.loading || this.user.firstName === firstName) {
      return;
    }

    this.loading = true;

    this.userService
      .updateUsername(firstName)
      .pipe(take(1))
      .subscribe(
        () => {
          this.authService.user$.next({
            ...this.authService.user,
            firstName,
          });

          this.loading = false;

          Swal.fire({
            title: 'Отлично!',
            text: 'Ваше имя изменено!',
            icon: 'success',
          });
        },
        () => (this.loading = false),
      );
  }

  updateMobileNumber() {
    const { mobileNumber } = this.settingsForm.value;

    if (this.loading || this.user.mobileNumber === mobileNumber) {
      return;
    }

    this.loading = true;

    this.userService
      .updateMobileNumber(mobileNumber)
      .pipe(take(1))
      .subscribe(
        () => {
          this.authService.user$.next({
            ...this.authService.user,
            mobileNumber,
          });

          this.loading = false;

          Swal.fire({
            title: 'Отлично!',
            text: 'Ваш номер телефона изменён!',
            icon: 'success',
          });
        },
        () => (this.loading = false),
      );
  }

  updateEmail() {
    const { email } = this.settingsForm.value;

    if (this.loading || this.user.email === email) {
      return;
    }

    this.loading = true;

    this.userService
      .updateEmail(email)
      .pipe(take(1))
      .subscribe(
        () => {
          this.authService.user$.next({
            ...this.authService.user,
            email,
          });

          this.loading = false;

          Swal.fire({
            title: 'Good job!',
            text: 'Your email was sucessfully updated!',
            icon: 'success',
          });
        },
        () => (this.loading = false),
      );
  }

  updatePassword() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    const clear = () => {
      this.loading = false;

      this.settingsForm.patchValue({
        currentPassword: null,
        password: null,
        confirmPassword: null,
      });
    };

    const data: UpdatePasswordBody = this.settingsForm.value;

    this.userService
      .updatePassword(data)
      .pipe(take(1))
      .subscribe(async () => {
        clear();

        await Swal.fire({
          title: 'Good job!',
          text: 'Your password was sucessfully updated!',
          icon: 'success',
        });

        this.openLogoutDialog();
      }, clear);
  }

  private openLogoutDialog() {
    const dialog = this.dialog.open<ConfirmDialogData>(ConfirmDialogComponent, {
      data: {
        title: 'Global logout',
        description: 'Do you want to logout from all of your devices?',
      },
    });

    dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe(confirm => {
        if (confirm) {
          this.logoutFromAllDevices();
        }
      });
  }

  private logoutFromAllDevices() {
    this.authService
      .logoutFromAllDevices()
      .pipe(take(1))
      .subscribe(() =>
        Swal.fire({
          title: 'Good job!',
          text: 'All of your devices were successfully logged out!',
          icon: 'success',
        }),
      );
  }
}
