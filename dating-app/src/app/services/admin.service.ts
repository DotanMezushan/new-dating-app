import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserResponse } from '../models/login.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl: string = environment.apiUrl;
  constructor(
    private http:HttpClient
  ) {

   }

   getUsersWithRoles() : Observable<UserResponse[]>{
    return this.http.get<UserResponse[]>(`${this.baseUrl}admin/users-with-roles`);
  }

  updateUserRoles(userName:string, roles: string[]) : Observable<any>{
    return this.http.post(`${this.baseUrl}admin/edit-roles/${userName}?roles=${roles}`,{});
  }
}
