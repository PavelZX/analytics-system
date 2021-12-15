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
import { UserService } from '../../service/user.service';

interface InternalUser extends User {
  members: User[];
}

@Component({
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit, OnDestroy {
  userId: string;
  user: InternalUser;
  destroy$ = new Subject();
  MessageType = MessageType;
  areMembersShown = false;
  messages: Message[] = [];
  updateMessages$ = new Subject();
  showTotalMembers = true;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private socket: MainSocket,
    private router: Router,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  get onlineMembers() {
    return this.user.members.filter(user => user.online);
  }

  ngOnInit() {
    // Subscribe to user events
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        mergeMap(params => {
          this.userId = params.id;

          return this.userService.joinUser(this.userId).pipe(take(1));
        }),
        catchError(() => this.router.navigate(['/users'])),
        filter<InternalUser>(user => typeof user !== 'boolean'),
        mergeMap(user => {
          this.user = user;

          this.changeDetector.detectChanges();

          return this.socket.onConnect();
        }),
        tap(() => {

          this.updateMessages$.next();
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    interval(5000)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.user != null),
        mergeMap(() => this.userService.getUser(this.userId).pipe(take(1))),
        tap<InternalUser>(
          user => (this.user = user),
          () => this.router.navigate(['/users']),
        ),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
