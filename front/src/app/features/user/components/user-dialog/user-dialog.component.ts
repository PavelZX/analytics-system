import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { UserService } from '../../service/user.service';
import { User } from '../../../auth/service/auth.service';

export enum ActionType {
  Update,
  Create,
}

export interface UpsertDialogData {
  type: ActionType;
  user?: User;
}

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent {
  type: ActionType;
  upsertForm = this.formBuilder.group({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    isPublic: false,
  });

  user: User;

  ActionType = ActionType;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: UpsertDialogData,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
  ) {
    this.type = data.type;
    this.user = data.user;

    this.upsertForm.patchValue({
      ...this.user,
    });
  }

  submit() {
    const userInput = this.upsertForm.value;

    let request = this.userService.createUser(userInput);

    if (this.type === ActionType.Update) {
      request = this.userService.updateUser(this.user._id, userInput);
    }

    request.pipe(take(1)).subscribe(user =>
      this.dialogRef.close({
        ...user,
        firstName: userInput.firstName,
        lastName: userInput.lastName,
        mobileNumber: userInput.mobileNumber,
        email: userInput.lastName,
        isPublic: userInput.isPublic,
      }),
    );
  }
}
