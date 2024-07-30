import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject } from 'rxjs';
import { LoginModel, UserResponse } from '../models/login.model';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSource = new ReplaySubject<UserResponse | null>(1);
  public currentUser$ = this.currentUserSource.asObservable();
  public isAuthenticated: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackbarService: SnackbarService,
  ) {}

  baseUrl = environment.apiUrl;

  login(model: LoginModel): Observable<any> {
    return this.http.post<UserResponse>(`${this.baseUrl}Account/login`, model).pipe(
      map((response: UserResponse) => {
        if (response && response.token) {
          this.currentUserSource.next(response);
          this.isAuthenticated = true;
          localStorage.setItem('authToken', response.token);
        }
      })
    );
  }

  register(model: LoginModel): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Account/register`, model).pipe(
      map((response: UserResponse) => {
        if (response && response.token) {
          this.currentUserSource.next(response);
          this.isAuthenticated = true;
          localStorage.setItem('authToken', response.token);
        }
      })
    );
  }

  setCurrentUser(user: UserResponse) {
    if (user.token) {
      localStorage.setItem('authToken', user.token);
    }
  }

  setLogOut() {
    this.currentUserSource.next(null);
    this.isAuthenticated = false;
    localStorage.removeItem('authToken');
    this.snackbarService.showSnackbar("You logged out", null, 3000);
    this.router.navigate(['/login']);
  }

  navigateToHomePage(): void {
    this.router.navigate(['/home']);
  }

  navigateToDev(): void{
    this.router.navigate(['/member/edit']);
  }

  getToken(): string  {
    let tokenString = localStorage.getItem('authToken');
    if(tokenString) {
      return tokenString;
    }else{
      return "";
    }
  }
}
