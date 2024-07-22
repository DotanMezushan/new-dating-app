import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule,FlexLayoutModule
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  isAuth:boolean = false;
  constructor (
    private router : Router
  ){

  }

  onToggleSidenav(){
    //this.sidenavToggle.emit();
  }
  onLogout(){
    //this.authService.logout();
  }

  signup(){
    this.router.navigate(['/signup']);
  }

  login(){
    this.router.navigate(['/login']);
  }

}
