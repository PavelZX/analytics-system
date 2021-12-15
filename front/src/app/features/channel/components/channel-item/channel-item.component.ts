import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { remove } from 'lodash';
import { take, tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { updateItem } from '../../../../shared/utils/upsert-item';
import { Channel, ChannelService } from '../../service/channel.service';

@Component({
  selector: 'app-channel-item',
  templateUrl: './channel-item.component.html',
  styleUrls: ['./channel-item.component.scss'],
})
export class ChannelItemComponent {
  @Input() channel: Channel;
  @Input() activeChannels: Channel[] = [];

  loading = false;

  constructor(
    private channelService: ChannelService,
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private router: Router,
  ) {}

  confirmDelete() {
    const dialog = this.dialog.open(ConfirmDialogComponent);

    dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe(confirm => {
        if (confirm) {
          this.delete();
        }
      });
  }

  delete() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.channelService
      .deleteChannel(this.channel)
      .pipe(take(1))
      .subscribe(() => {
        this.loading = false;

        remove(this.activeChannels, r => r._id === this.channel._id);
      });
  }

  openChannel() {
    this.loading = true;

    const process = () => (this.loading = false);

    this.channelService
      .getChannel(this.channel._id)
      .pipe(take(1), tap(process, process))
      .subscribe(() => this.router.navigate(['/channel', this.channel._id]));
  }

  isString<T>(value: T) {
    return typeof value === 'string';
  }
}
