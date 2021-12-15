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
  UserDialogComponent,
} from '../../components/user-dialog/user-dialog.component';
import { UserService } from '../../service/user.service';

@Component({
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss'],
})
export class UsersPageComponent implements OnInit, OnDestroy {
  allUsers: User[] = [];
  publicUsers: User[] = [];
  memberUsers: User[] = [];
  user: User;

  loading = false;

  destroy$ = new Subject();

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private authService: AuthService,
    private clipboard: Clipboard,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loading = true;

    const process = () => (this.loading = false);

    forkJoin({
      allUsers: this.userService.getUsers().pipe(take(1)),
      publicUsers: this.userService.getPublicUsers().pipe(take(1)),
    })
      .pipe(tap(process, process))
      .subscribe(({ allUsers, publicUsers }) => {
        this.allUsers = allUsers;
        this.publicUsers = publicUsers;
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
    const dialog = this.dialog.open(UserDialogComponent, {
      data: {
        type: ActionType.Create,
      },
    });
  }
}
