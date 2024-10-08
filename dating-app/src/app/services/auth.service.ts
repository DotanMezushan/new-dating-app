import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject } from 'rxjs';
import { LoginModel, UserResponse } from '../models/login.model';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { environment } from '../../environments/environment';
import { PresenceService } from './presence.service';

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
    private presenceService : PresenceService
  ) {}

  baseUrl = environment.apiUrl;

  login(model: LoginModel): Observable<any> {
    return this.http
      .post<UserResponse>(`${this.baseUrl}Account/login`, model)
      .pipe(
        map((response: UserResponse) => {
          if (response && response.token) {
            this.setCurrentUser(response);
          }
        })
      );
  }

  register(model: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Account/register`, model).pipe(
      map((response: UserResponse) => {
        if (response && response.token) {
          this.setCurrentUser(response);
        }
      })
    );
  }

  setCurrentUser(user: UserResponse): void {


    if(user == null) {
      return;
    }
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    this.currentUserSource.next(user);
    this.isAuthenticated = true;
    localStorage.setItem('user', JSON.stringify(user));
    this.presenceService.createHubConnection (user);
    this.navigateToMembers();
  }

  setLogOut() {
    this.currentUserSource.next(null);
    this.isAuthenticated = false;
    this.presenceService.stopHubConnection();
    localStorage.removeItem('user');
    //this.snackbarService.showSnackbar('You logged out', null, 3000);
    this.router.navigate(['/login']);
  }

  navigateToHomePage(): void {
    this.router.navigate(['/home']);
  }

  navigateToDev(): void {
    this.router.navigate(['/member/edit']);
  }

  navigateToMembers(): void {
    this.router.navigate(['/members']);
  }

  

  getToken(): string {
    let user : UserResponse = JSON.parse(localStorage.getItem('user') as any); 
    if (user && user.token) {
      return user.token;
    } else {
      return '';
    }
  }

  getDecodedToken(token : string | undefined): any {
    if(token) {
      return JSON.parse(atob(token.split('.')[1]) )// to get the payload
    }else{
      return null;
    }
  }
}
