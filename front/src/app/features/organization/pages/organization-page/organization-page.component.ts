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
import { Organization, OrganizationService } from '../../service/organization.service';

interface InternalOrganization extends Organization {
  members: User[];
}

@Component({
  templateUrl: './organization-page.component.html',
  styleUrls: ['./organization-page.component.scss'],
})
export class OrganizationPageComponent implements OnInit, OnDestroy {
  organizationId: string;
  organization: InternalOrganization;
  destroy$ = new Subject();
  MessageType = MessageType;
  areMembersShown = false;
  messages: Message[] = [];
  updateMessages$ = new Subject();
  user: User;
  showTotalMembers = true;

  constructor(
    private organizationService: OrganizationService,
    private route: ActivatedRoute,
    private socket: MainSocket,
    private router: Router,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  get onlineMembers() {
    return this.organization.members.filter(user => user.online);
  }

  ngOnInit() {
    interval(5000)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.organization != null),
        mergeMap(() => this.organizationService.getOrganization(this.organizationId).pipe(take(1))),
        tap<InternalOrganization>(
          organization => (this.organization = organization),
          () => this.router.navigate(['/organizations']),
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
