import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserManagementComponent } from '../../tabs/admin/user-management/user-management.component';
import { PhotoManagementComponent } from '../../tabs/admin/photo-management/photo-management.component';
import { MatTabsModule } from '@angular/material/tabs';
import { HasRoleDirective } from '../../directives/has-role.directive';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    HasRoleDirective,
    UserManagementComponent,
    PhotoManagementComponent,

  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {
  allowedRoles : string[] = ['Admin', 'Moderator'];


}
