import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { UserResponse } from '../models/login.model';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: 
  [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    RouterModule
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit , OnDestroy {
  currentUser: UserResponse | undefined | null = undefined;
  activeRoute: string = '';
  private authStatusSubscription: Subscription | undefined;
  private routerSubscription: Subscription | undefined;
  
  constructor (
    private router : Router,
    private authService: AuthService,
  ){

  }

  ngOnInit(): void {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.activeRoute = event.urlAfterRedirects;
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

  navigate(url : string ){
    this.router.navigateByUrl(url);
  }

  isActive(route: string): boolean {
    return this.activeRoute === route;
  }

  isAuthenticated(): boolean {
    let tokenString: string = this.authService.getToken();
    if(tokenString?.length>10){
      return true;
    }else{
      return false;
    }
  }

  getPhotoUrl(): string {
    let user : UserResponse = JSON.parse(localStorage.getItem('user') as any); 
    if(user &&  user.photoUrl){
      return user.photoUrl;
    }else{
      return "";
    }
  }

}
