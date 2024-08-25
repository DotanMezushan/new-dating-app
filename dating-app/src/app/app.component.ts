import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './auth/login/login.component';
import { HasRoleDirective } from './directives/has-role.directive';
import { UserResponse } from './models/login.model';
import { AuthService } from './services/auth.service';
import { PresenceService } from './services/presence.service';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';
import {MatSidenavModule} from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: 
  [
    RouterOutlet,
    CommonModule,
    NavComponent, 
    LoginComponent, 
    HasRoleDirective,
    SidenavListComponent,
    MatSidenavModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] 
})
export class AppComponent implements OnInit {
  title = 'dating-app';
  users: any;

  constructor(
    private authService : AuthService,
    private presenceService : PresenceService
      ) {}

  ngOnInit(): void {
    this.setCurrentUser();
  }
  setCurrentUser() {
    try{
      const user: UserResponse = JSON.parse(localStorage.getItem("user") as string);
      if(user){
        this.authService.setCurrentUser(user);
        this.presenceService.createHubConnection(user);
      }
    }catch(error){
      console.log(error);
      console.log("setCurrentUser, appComponent");
    }
  }
}
