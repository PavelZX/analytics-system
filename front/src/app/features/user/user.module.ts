import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { SharedModule } from '../../shared/shared.module';
import { RecoverPageComponent } from './pages/recover-page/recover-page.component';
import { RecoverChangePasswordPageComponent } from './pages/recover-change-password-page/recover-change-password-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { UserService } from './service/user.service';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { UserItemComponent } from './components/user-item/user-item.component';
import { UserDialogComponent } from "./components/user-dialog/user-dialog.component";

@NgModule({
  declarations: [
    SettingsPageComponent,
    RecoverPageComponent,
    RecoverChangePasswordPageComponent,
    UsersPageComponent,
    UserPageComponent,
    UserDialogComponent,
    UserItemComponent,
  ],
  imports: [CommonModule, SharedModule],
  providers: [UserService],
  exports: [
    SettingsPageComponent,
    RecoverPageComponent,
    RecoverChangePasswordPageComponent,
    UsersPageComponent,
    UserPageComponent,
  ],
})
export class UserModule {}
