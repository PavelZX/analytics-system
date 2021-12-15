import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Organization, OrganizationService } from '../../service/organization.service';

export enum ActionType {
  Update,
  Create,
}

export interface UpsertDialogData {
  type: ActionType;
  organization?: Organization;
}

@Component({
  selector: 'app-organization-dialog',
  templateUrl: './organization-dialog.component.html',
  styleUrls: ['./organization-dialog.component.scss'],
})
export class OrganizationDialogComponent {
  type: ActionType;
  upsertForm = this.formBuilder.group({
    title: '',
    description: '',
    balance: '0.00',
    isActive: false,
  });

  organization: Organization;

  ActionType = ActionType;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: UpsertDialogData,
    private organizationService: OrganizationService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<OrganizationDialogComponent>,
  ) {
    this.type = data.type;
    this.organization = data.organization;

    this.upsertForm.patchValue({
      ...this.organization,
    });
  }

  submit() {
    const organizationInput = this.upsertForm.value;

    let request = this.organizationService.createOrganization(organizationInput);

    if (this.type === ActionType.Update) {
      request = this.organizationService.updateOrganization(this.organization._id, organizationInput);
    }

    request.pipe(take(1)).subscribe(organization =>
      this.dialogRef.close({
        ...organization,
        title: organizationInput.title,
        description: organizationInput.description,
        isActive: organizationInput.isActive,
        balance: organizationInput.balance,
      }),
    );
  }
}
