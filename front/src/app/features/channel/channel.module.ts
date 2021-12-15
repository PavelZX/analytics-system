import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelsPageComponent } from './pages/channels-page/channels-page.component';
import { SharedModule } from '../../shared/shared.module';
import { ChannelService } from './service/channel.service';
import { ChannelPageComponent } from './pages/channel-page/channel-page.component';
import { ChannelItemComponent } from './components/channel-item/channel-item.component';
import { ChannelDialogComponent } from "./components/channel-dialog/channel-dialog.component";

@NgModule({
  declarations: [
    ChannelsPageComponent,
    ChannelPageComponent,
    ChannelDialogComponent,
    ChannelItemComponent,
  ],
  imports: [CommonModule, SharedModule],
  providers: [ChannelService],
  exports: [ChannelsPageComponent, ChannelPageComponent],
})
export class ChannelModule {}
