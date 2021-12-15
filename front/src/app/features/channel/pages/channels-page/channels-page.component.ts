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
import { Channel, ChannelService } from '../../service/channel.service';
import {
  ActionType,
  ChannelDialogComponent,
} from '../../components/channel-dialog/channel-dialog.component';


@Component({
  templateUrl: './channels-page.component.html',
  styleUrls: ['./channels-page.component.scss'],
})
export class ChannelsPageComponent implements OnInit, OnDestroy {
  activeChannels: Channel[] = [];
  allChannels: Channel[] = [];
  user: User;

  loading = false;

  destroy$ = new Subject();

  constructor(
    private channelService: ChannelService,
    private dialog: MatDialog,
    private authService: AuthService,
    private clipboard: Clipboard,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loading = true;

    const process = () => (this.loading = false);

    forkJoin({
      activeChannels: this.channelService.getActiveChannels().pipe(take(1)),
      allChannels: this.channelService.getChannels().pipe(take(1)),
    })
      .pipe(tap(process, process))
      .subscribe(({ activeChannels, allChannels }) => {
        this.activeChannels = activeChannels;
        this.allChannels = allChannels;
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
    const dialog = this.dialog.open(ChannelDialogComponent, {
      data: {
        type: ActionType.Create,
      },
    });
  }
}
