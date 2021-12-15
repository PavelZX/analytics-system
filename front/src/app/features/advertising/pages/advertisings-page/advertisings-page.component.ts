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
import { Advertising, AdvertisingService } from '../../service/advertising.service';
import {
  ActionType,
  AdvertisingDialogComponent,
} from '../../components/advertising-dialog/advertising-dialog.component';

@Component({
  templateUrl: './advertisings-page.component.html',
  styleUrls: ['./advertisings-page.component.scss'],
})
export class AdvertisingsPageComponent implements OnInit, OnDestroy {
  activeAdvertisings: Advertising[] = [];
  allAdvertisings: Advertising[] = [];
  yourAdvertisings: Advertising[] = [];
  user: User;

  loading = false;

  destroy$ = new Subject();

  constructor(
    private advertisingService: AdvertisingService,
    private dialog: MatDialog,
    private authService: AuthService,
    private clipboard: Clipboard,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loading = true;

    const process = () => (this.loading = false);

    forkJoin({
      activeAdvertisings: this.advertisingService.getActiveAdvertisings().pipe(take(1)),
      allAdvertisings: this.advertisingService.getAdvertisings().pipe(take(1)), 
    })
      .pipe(tap(process, process))
      .subscribe(({ activeAdvertisings, allAdvertisings }) => {
        this.activeAdvertisings = activeAdvertisings;
        this.allAdvertisings = allAdvertisings;
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
    const dialog = this.dialog.open(AdvertisingDialogComponent, {
      data: {
        type: ActionType.Create,
      },
    });
  }
}
