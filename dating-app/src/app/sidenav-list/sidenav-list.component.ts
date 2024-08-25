import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription, take } from 'rxjs';
import { UserResponse } from '../models/login.model';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HasRoleDirective } from '../directives/has-role.directive';




@Component({
  selector: 'app-sidenav-list',
  standalone: true,
  imports: [
    MatListModule, 
    MatIconModule, 
    CommonModule, 
    RouterLink,
    HasRoleDirective,
  ],
  templateUrl: './sidenav-list.component.html',
  styleUrl: './sidenav-list.component.scss'
})
export class SidenavListComponent {
  @Output() sidenavToggle = new EventEmitter<void>();
  authSubscription !: Subscription;
  allowedRoles : string[] = ['Admin', 'Moderator'];
  constructor(private authService :AuthService){
  }

  onToggleSidenav(){
    this.sidenavToggle.emit();
  }

  onLogout(){
    this.onToggleSidenav();
    this.authService.setLogOut();
  }

  isAuthenticated(): boolean {
    let tokenString: string = this.authService.getToken();
    if(tokenString?.length){
      return true;
    }else{
      return false;
    }
  }

}

