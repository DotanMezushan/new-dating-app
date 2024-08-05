import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Member } from '../models/member.model';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Photo } from '../models/photo.model';
import {PaginatedResult}  from '../models/pagination.model';
import { UserParams } from '../models/userParams.model';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private baseUrl = environment.apiUrl;
  members: Member[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackbarService: SnackbarService,
    private authService: AuthService
  ) {}


  getMembers(userParams: UserParams): Observable<PaginatedResult<Member[]>> {
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedReult<Member[]>(`${this.baseUrl}users`, params);
  }

  getMemberById(id: number): Observable<Member> {
    const member = this.members.find((m) => m.id === id);
    if (member !== undefined) {
      return of(member);
    } else {
      const params = new HttpParams().set('id', id.toString());
      return this.http.get<Member>(`${this.baseUrl}users/id`, { params });
    }
  }

  getMemberByName(userName: string): Observable<Member> {
    const member = this.members.find((m) => m.userName === userName);
    if (member !== undefined) {
      return of(member);
    } else {
      const params = new HttpParams().set('userName', userName);
      return this.http.get<Member>(`${this.baseUrl}users/userName`, { params });
    }
  }

  updateMember(member: Member): Observable<Member> {
    return this.http.put<Member>(`${this.baseUrl}users`, member);
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Photo>(`${this.baseUrl}users/add-photo`, formData);
  }

  setMainPhoto(photoId: number) {
    return this.http.put<any>(
      `${this.baseUrl}users/set-main-photo/${photoId}`,
      {}
    );
  }

  deletePhoto(photoId: number) {
    return this.http.delete<any>(
      `${this.baseUrl}users/delete-photo/${photoId}`
    );
  }

  private getPaginatedReult<T>(url: string, params: HttpParams): Observable<PaginatedResult<T>> {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http
      .get<T>(url, { observe: 'response', params })
      .pipe(
        map((response) => {
          if (response.body) {
            paginatedResult.result = response.body;
          }
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination') as string
            );
          }
          return paginatedResult;
        })
      );
  }

  private getPaginationHeaders(
    pageNumber: number,
    pageSize: number
  ): HttpParams {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return params;
  }
}
