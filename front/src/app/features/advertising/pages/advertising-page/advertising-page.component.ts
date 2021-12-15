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
import { Advertising, AdvertisingService } from '../../service/advertising.service';

interface InternalAdvertising extends Advertising {
  members: User[];
}

@Component({
  templateUrl: './advertising-page.component.html',
  styleUrls: ['./advertising-page.component.scss'],
})
export class AdvertisingPageComponent implements OnInit, OnDestroy {
  advertisingId: string;
  advertising: InternalAdvertising;
  destroy$ = new Subject();
  MessageType = MessageType;
  areMembersShown = false;
  messages: Message[] = [];
  updateMessages$ = new Subject();
  user: User;
  showTotalMembers = true;

  constructor(
    private advertisingService: AdvertisingService,
    private route: ActivatedRoute,
    private socket: MainSocket,
    private router: Router,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  get onlineMembers() {
    return this.advertising.members.filter(user => user.online);
  }

  ngOnInit() {

    interval(5000)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.advertising != null),
        mergeMap(() => this.advertisingService.getAdvertising(this.advertisingId).pipe(take(1))),
        tap<InternalAdvertising>(
          advertising => (this.advertising = advertising),
          () => this.router.navigate(['/advertisings']),
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
