import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Channel, ChannelService } from '../../service/channel.service';

export enum ActionType {
  Update,
  Create,
}

export interface UpsertDialogData {
  type: ActionType;
  channel?: Channel;
}

@Component({
  selector: 'app-channel-dialog',
  templateUrl: './channel-dialog.component.html',
  styleUrls: ['./channel-dialog.component.scss'],
})
export class ChannelDialogComponent {
  type: ActionType;
  upsertForm = this.formBuilder.group({
    title: '',
    description: '',
    isActive: false,
    balance: '0.00',
  });

  channel: Channel;

  ActionType = ActionType;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: UpsertDialogData,
    private channelService: ChannelService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ChannelDialogComponent>,
  ) {
    this.type = data.type;
    this.channel = data.channel;

    this.upsertForm.patchValue({
      ...this.channel,
    });
  }

  submit() {
    const channelInput = this.upsertForm.value;

    let request = this.channelService.createChannel(channelInput);

    if (this.type === ActionType.Update) {
      request = this.channelService.updateChannel(this.channel._id, channelInput);
    }

    request.pipe(take(1)).subscribe(channel =>
      this.dialogRef.close({
        ...channel,
        title: channelInput.title,
        description: channelInput.description,
        isActive: channelInput.isActive,
        balance: channelInput.balance,
      }),
    );
  }
}
