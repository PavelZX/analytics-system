import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Advertising, AdvertisingService } from '../../service/advertising.service';

export enum ActionType {
  Update,
  Create,
}

export interface UpsertDialogData {
  type: ActionType;
  advertising?: Advertising;
}

@Component({
  selector: 'app-advertising-dialog',
  templateUrl: './advertising-dialog.component.html',
  styleUrls: ['./advertising-dialog.component.scss'],
})
export class AdvertisingDialogComponent {
  type: ActionType;
  upsertForm = this.formBuilder.group({
    title: '',
    description: '',
    isActive: false,
  });

  advertising: Advertising;

  ActionType = ActionType;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: UpsertDialogData,
    private advertisingService: AdvertisingService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AdvertisingDialogComponent>,
  ) {
    this.type = data.type;
    this.advertising = data.advertising;

    this.upsertForm.patchValue({
      ...this.advertising,
    });
  }

  submit() {
    const advertisingInput = this.upsertForm.value;

    let request = this.advertisingService.createAdvertising(advertisingInput);

    if (this.type === ActionType.Update) {
      request = this.advertisingService.updateAdvertising(this.advertising._id, advertisingInput);
    }

    request.pipe(take(1)).subscribe(advertising =>
      this.dialogRef.close({
        ...advertising,
        title: advertisingInput.title,
        description: advertisingInput.description,
        isActive: advertisingInput.isActive,
      }),
    );
  }
}
