import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { UserResponse } from '../models/login.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule,FlexLayoutModule
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit , OnDestroy {
  isAuth:boolean = false;
  currentUser: UserResponse | undefined | null = undefined;
  private authStatusSubscription: Subscription | undefined;
  
  constructor (
    private router : Router,
    private authService: AuthService
  ){

  }

  ngOnInit(): void {
    this.authStatusSubscription = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isAuth = !!user;
    });
  }

  ngOnDestroy(): void {
    if (this.authStatusSubscription) {
      this.authStatusSubscription.unsubscribe();
    }
  }


  onToggleSidenav(){
    //this.sidenavToggle.emit();
  }
  onLogout(){
    this.authService.setLogOut();
  }

  signup(){
    this.router.navigate(['/signup']);
  }

  login(){
    this.router.navigate(['/login']);
  }

}
