import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from '../models/member.model';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private snackbarService: SnackbarService,
    private authService: AuthService
  ) {}

  getMembers(): Observable<Member[]> {
    const httpOptions = this.createHttpOptions();
    return this.http.get<Member[]>(`${this.baseUrl}users`, httpOptions);
  }

  getMemberById(id: number): Observable<Member> {
    const httpOptions = this.createHttpOptions();
    const params = new HttpParams().set('id', id.toString());

    return this.http.get<Member>(`${this.baseUrl}users/id`, { headers: httpOptions.headers, params });
  }

  getMemberByName(userName: string): Observable<Member> {
    const httpOptions = this.createHttpOptions();

    const params = new HttpParams().set('userName', userName);

    return this.http.get<Member>(`${this.baseUrl}users/name`, { headers: httpOptions.headers, params });
  }

  private createHttpOptions(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });

    return { headers };
  }
}
