import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SnackbarService } from './snackbar.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { PaginationHelperService } from './pagination-helper.service';
import { Message } from '../models/message.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;

  constructor(
    private paginationHelper : PaginationHelperService,
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private authService: AuthService
  ) { 

  }

  getMessages(pageNumber : number, pageSize: number, container: string){
    let params = this.paginationHelper.getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return this.paginationHelper.getPaginatedReult<Message[]>(this.baseUrl+"Messages",params, this.http );
  }

  getMessageThead(userName: string){
    return this.http.get<Message[]>(this.baseUrl+"Messages/thread/"+ userName)
  }

  sendMessage(userName: string, content: string){
     return this.http.post<Message>(this.baseUrl+"Messages",{RecipientUserName: userName,Content: content})
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}Messages/${id}`).pipe(
      catchError(error => {
        console.log(error);
        return throwError(error);
      })
    );
  }
  

}
