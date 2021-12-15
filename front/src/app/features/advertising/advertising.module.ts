import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvertisingsPageComponent } from './pages/advertisings-page/advertisings-page.component';
import { SharedModule } from '../../shared/shared.module';
import { AdvertisingService } from './service/advertising.service';
import { AdvertisingPageComponent } from './pages/advertising-page/advertising-page.component';
import { AdvertisingItemComponent } from './components/advertising-item/advertising-item.component';
import { AdvertisingDialogComponent } from "./components/advertising-dialog/advertising-dialog.component";

@NgModule({
  declarations: [
    AdvertisingsPageComponent,
    AdvertisingPageComponent,
    AdvertisingDialogComponent,
    AdvertisingItemComponent,
  ],
  imports: [CommonModule, SharedModule],
  providers: [AdvertisingService],
  exports: [AdvertisingsPageComponent, AdvertisingPageComponent],
})
export class AdvertisingModule {}
