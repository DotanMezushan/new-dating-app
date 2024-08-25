import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, take } from 'rxjs';
import { Member } from '../models/member.model';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Photo } from '../models/photo.model';
import {PaginatedResult}  from '../models/pagination.model';
import { UserParams } from '../models/userParams.model';
import { UserResponse } from '../models/login.model';
import { PaginationHelperService } from './pagination-helper.service';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private baseUrl = environment.apiUrl;
  members: Member[] = [];
  user !: UserResponse;
  userParams !: UserParams;
  memberCache = new Map();

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private paginationHelper : PaginationHelperService
  ) {
    this.authService.currentUser$.pipe(take(1)).subscribe((user: any) => {
      this.user = user;
      this.userParams = new UserParams(user);
    });
  }


  getMembers(userParams: UserParams): Observable<PaginatedResult<Member[]>> {
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if(response){
      return of(response);
    }else{
      let params =  this.paginationHelper.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
      params = params.append('minAge', userParams.minAge.toString());
      params = params.append('maxAge', userParams.maxAge.toString());
      params = params.append('gender', userParams.gender);
      if(userParams.orderBy){
        params = params.append('orderBy', userParams.orderBy);
      }
  
      return this.paginationHelper.getPaginatedReult<Member[]>(`${this.baseUrl}users`,params,this.http )
      .pipe(map(response =>{
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      }
      ));
    }
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
    const member = [...this.memberCache.values()]
    .reduce((arr,element) => arr.concat(element.result),[])
    .find((member: Member) => member.userName === userName);
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

  addLike(userName: string){
    return this.http.post<any>(this.baseUrl + 'likes/'+ userName,{})
  }

  getLikes(predicate: string, pageNumber: number, pageSize : number ) {
    let params =   this.paginationHelper.getPaginationHeaders(pageNumber,pageSize);
    params = params.append('predicate', predicate);
    return this.paginationHelper.getPaginatedReult<any>(this.baseUrl + 'likes', params, this.http);
  }



  getUserParams(): UserParams{
    return this.userParams;
  }

  setUserParams(params: UserParams): void{
    this.userParams = params;
  }

  resetUserParams() : UserParams{
      this.userParams = new UserParams(this.user);
      return this.userParams;
  }
}
