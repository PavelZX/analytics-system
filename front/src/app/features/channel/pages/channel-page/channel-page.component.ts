import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { remove } from 'lodash';
import { interval, Subject } from 'rxjs';
import {
  catchError,
  filter,
  mergeMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { MainSocket } from '../../../../core/socket/main-socket';
import { AuthService, User } from '../../../auth/service/auth.service';
import { MessageType } from '../../../messages/components/messages/messages.component';
import { Message } from '../../../messages/service/message.service';
import { Channel, ChannelService } from '../../service/channel.service';

interface InternalChannel extends Channel {
  members: User[];
}

@Component({
  templateUrl: './channel-page.component.html',
  styleUrls: ['./channel-page.component.scss'],
})
export class ChannelPageComponent implements OnInit, OnDestroy {
  channelId: string;
  channel: InternalChannel;
  destroy$ = new Subject();
  MessageType = MessageType;
  areMembersShown = false;
  messages: Message[] = [];
  updateMessages$ = new Subject();
  user: User;
  showTotalMembers = true;

  constructor(
    private channelService: ChannelService,
    private route: ActivatedRoute,
    private socket: MainSocket,
    private router: Router,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  get onlineMembers() {
    return this.channel.members.filter(user => user.online);
  }

  ngOnInit() {

    interval(5000)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.channel != null),
        mergeMap(() => this.channelService.getChannel(this.channelId).pipe(take(1))),
        tap<InternalChannel>(
          channel => (this.channel = channel),
          () => this.router.navigate(['/channels']),
        ),
      )
      .subscribe();

    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => (this.user = user));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
