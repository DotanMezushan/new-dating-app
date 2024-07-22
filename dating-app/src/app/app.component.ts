import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './auth/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule,
    NavComponent, LoginComponent, RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // Corrected from styleUrl to styleUrls
})
export class AppComponent implements OnInit {
  title = 'dating-app';
  users: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get("http://localhost:5001/api/users").subscribe({
      next: (users: any) => {
        this.users = users;
      },
      error: (err) => {
        console.error("Error fetching users:", err);
      }
    });
  }
}
