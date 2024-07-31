import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (component) => {
  const dialog = inject(MatDialog);
  if (component.memberForm.dirty) {
    const dialogRef = dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Navigation',
        content: 'Are you sure you want to leave this page? Unsaved changes will be lost.'
      }
    });
    return dialogRef.afterClosed();
  }
  return true;
};
