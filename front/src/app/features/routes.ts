import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { MainComponent } from './main/main.component';
import { RegisterPageComponent } from './auth/pages/register-page/register-page.component';
import { AuthGuard } from './auth/guard/auth.guard';
import { SettingsPageComponent } from './user/pages/settings-page/settings-page.component';
import { RecoverChangePasswordPageComponent } from './user/pages/recover-change-password-page/recover-change-password-page.component';
import { RoomPageComponent } from './room/pages/room-page/room-page.component';
import { RoomsPageComponent } from './room/pages/rooms-page/rooms-page.component';
import { OrganizationPageComponent } from './organization/pages/organization-page/organization-page.component';
import { OrganizationsPageComponent } from './organization/pages/organizations-page/organizations-page.component';
import { UserPageComponent } from './user/pages/user-page/user-page.component';
import { UsersPageComponent } from './user/pages/users-page/users-page.component';
import { AdvertisingPageComponent } from './advertising/pages/advertising-page/advertising-page.component';
import { AdvertisingsPageComponent } from './advertising/pages/advertisings-page/advertisings-page.component';
import { ChannelPageComponent } from './channel/pages/channel-page/channel-page.component';
import { ChannelsPageComponent } from './channel/pages/channels-page/channels-page.component';
import { RecoverPageComponent } from './user/pages/recover-page/recover-page.component';
import { DirectMessagePageComponent } from './messages/pages/direct-message-page/direct-message-page.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [AuthGuard],
    data: {
      requireAuth: false,
    },
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    canActivate: [AuthGuard],
    data: {
      requireAuth: false,
    },
  },
  {
    path: 'recover',
    pathMatch: 'full',
    component: RecoverPageComponent,
    canActivate: [AuthGuard],
    data: {
      requireAuth: false,
    },
  },
  {
    path: 'recover/:code',
    pathMatch: 'full',
    component: RecoverChangePasswordPageComponent,
    canActivate: [AuthGuard],
    data: {
      requireAuth: false,
    },
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'room/:id',
    component: RoomPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'rooms',
    component: RoomsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user/:id',
    component: UserPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    component: UsersPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'organization/:id',
    component: OrganizationPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'organizations',
    component: OrganizationsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'advertising/:id',
    component: AdvertisingPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'advertisings',
    component: AdvertisingsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'channel/:id',
    component: ChannelPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'channels',
    component: ChannelsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'direct-message/:firstName',
    component: DirectMessagePageComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/' },
];
