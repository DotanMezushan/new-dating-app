import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SnackbarService } from './snackbar.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { PaginationHelperService } from './pagination-helper.service';
import { Message } from '../models/message.model';
import { BehaviorSubject, catchError, Observable, take, throwError } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { UserResponse } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection !: HubConnection;
  private messageThreadSource: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  public messageThread$ = this.messageThreadSource.asObservable();

  constructor(
    private paginationHelper : PaginationHelperService,
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private authService: AuthService
  ) { 

  }

  createHubConnection(user: UserResponse, otherUserName :string){
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(`${this.hubUrl}message?user=${otherUserName}`, {
      accessTokenFactory: () => user.token || ""
    })
    .withAutomaticReconnect ()
    .build();

    this.hubConnection.start().catch((error) => { console.log(error); });

    this.hubConnection.on("ReceiveMessageThread", messages => {
      this.messageThreadSource.next(messages);
    });

    this.hubConnection.on("NewMessage", (message) => {
      this.messageThread$.pipe(
        (take(1))
      ).subscribe((messges: Message[])=>{
        this.messageThreadSource.next([...messges, message]);// this to new message to Message[]
      })
    });

  }

  stopHubConnection(){
    if (this.hubConnection) {
      this.hubConnection.stop().catch((error) =>  { console.log(error); });
    }
  }

  getMessages(pageNumber : number, pageSize: number, container: string){
    let params = this.paginationHelper.getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return this.paginationHelper.getPaginatedReult<Message[]>(this.baseUrl+"Messages",params, this.http );
  }

  getMessageThead(userName: string){
    return this.http.get<Message[]>(this.baseUrl+"Messages/thread/"+ userName)
  }

  async sendMessage(userName: string, content: string){
    //  return this.http.post<Message>(this.baseUrl+"Messages",{RecipientUserName: userName,Content: content})
    return this.hubConnection.invoke('SendMessage',{RecipientUserName: userName,Content: content})
    .catch(error => console.log(error));
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
