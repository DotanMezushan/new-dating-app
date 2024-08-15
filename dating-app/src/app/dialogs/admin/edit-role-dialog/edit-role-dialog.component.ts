import { AfterViewInit, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  selector: 'app-edit-role-dialog',
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatButtonModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './edit-role-dialog.component.html',
  styleUrls: ['./edit-role-dialog.component.scss']
})
export class EditRoleDialogComponent  {

  roles: { [key: string]: boolean } = {
    Admin: false,
    Moderator: false,
    Member: false,
  };

  roleKeys = Object.keys(this.roles);

  constructor(
    public dialogRef: MatDialogRef<EditRoleDialogComponent>,
    private _focusMonitor: FocusMonitor,
    @Inject(MAT_DIALOG_DATA) public data: { userName: string, roles: string[] }
  ) {
    this.initializeRoles();
  }

  initializeRoles(): void {
    this.roleKeys.forEach(role => {
      this.roles[role] = this.data.roles.includes(role);
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const updatedRoles = this.roleKeys.filter(role => this.roles[role]);
    this.dialogRef.close(updatedRoles);
  }

  isDisabled(role: string): boolean {
    return this.data.userName === 'admin' || role === 'Admin';
  }
}
