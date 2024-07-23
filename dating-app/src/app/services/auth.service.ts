import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject } from 'rxjs';
import { LoginModel, UserResponse } from '../models/login.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSource = new ReplaySubject<UserResponse>(1);
  public currentUser$ = this.currentUserSource.asObservable();

  constructor(private http : HttpClient ) { }
  baseUrl = "http://localhost:5001/api/"

  login(model: LoginModel): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Account/login`, model).pipe(
      map((response: UserResponse) => {
        if(response){
          sessionStorage.setItem('user', JSON.stringify(response));
          this.currentUserSource.next(response);
        };
      })
    )
  }

  register(model: LoginModel): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Account/register`, model).pipe(
      map((response: UserResponse) => {
        if(response){
          sessionStorage.setItem('user', JSON.stringify(response));
        };
      })
    )
  }

  setCurrentUser(user : UserResponse){
    this.currentUserSource.next(user);
  }
}
