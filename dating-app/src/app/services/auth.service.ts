import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject } from 'rxjs';
import { LoginModel, UserResponse } from '../models/login.model';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSource = new ReplaySubject<UserResponse | null>(1);
  public currentUser$ = this.currentUserSource.asObservable();
  public isAuthenticated : boolean = false;

  constructor(private http: HttpClient, 
    private router: Router,
    private snackbarService : SnackbarService
  ) {}
  baseUrl = 'http://localhost:5001/api/';

  login(model: LoginModel): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Account/login`, model).pipe(
      map((response: UserResponse) => {
        if (response) {
          this.currentUserSource.next(response);
          this.isAuthenticated = true;
        }
      })
    );
  }

  register(model: LoginModel): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Account/register`, model).pipe(
      map((response: UserResponse) => {
        if (response) {
          this.currentUserSource.next(response);
          this.isAuthenticated = true;
        }
      })
    );
  }

  setCurrentUser(user: UserResponse) {
    this.currentUserSource.next(user);
  }

  setLogOut() {
    this.currentUserSource.next(null);
    this.isAuthenticated = false;
    this.snackbarService.showSnackbar("You logout", null,3000);
    this.router.navigate(['/login']);
  }

  navigateToHomePage(): void {
    this.router.navigate(['/home']);
  }
  
}
