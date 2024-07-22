import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginModel } from '../models/login.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient ) { }
  baseUrl = "http://localhost:5001/api/"

  login(model: LoginModel): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Account/login`, model)
  }

  register(model: LoginModel): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Account/register`, model);
  }
}
