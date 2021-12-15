import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { OrganizationsPageComponent } from './pages/organizations-page/organizations-page.component';
import { OrganizationService } from './service/organization.service';
import { OrganizationPageComponent } from './pages/organization-page/organization-page.component';
import { OrganizationItemComponent } from './components/organization-item/organization-item.component';
import { OrganizationDialogComponent } from "./components/organization-dialog/organization-dialog.component";

@NgModule({
  declarations: [
    OrganizationsPageComponent,
    OrganizationPageComponent,
    OrganizationDialogComponent,
    OrganizationItemComponent,
  ],
  imports: [CommonModule, SharedModule],
  providers: [OrganizationService],
  exports: [OrganizationsPageComponent, OrganizationPageComponent],
})
export class OrganizationModule {}
