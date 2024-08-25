import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr'
import { SnackbarService } from './snackbar.service';
import { UserResponse } from '../models/login.model';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection!: HubConnection;
  private onlineUsersSource : BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(
    private snackbarService : SnackbarService,
    private router: Router
  ) { }

  createHubConnection(user: UserResponse){
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(`${this.hubUrl}presence`, {
      accessTokenFactory: () => user.token || ""
    })
    .withAutomaticReconnect ()
    .build();

    this.hubConnection.start()
    .catch(error => console.log(error));

    this.hubConnection.on("UserIsOnline", userName => {// same name as server!!!
      //this.snackbarService.showSnackbar(userName + "  has connected", null,3000);
      this.onlineUsers$.pipe(take(1)).subscribe(userNames => {
        this.onlineUsersSource.next([...userNames, userName])
      });
    });

    this.hubConnection.on("UserIsOffline", userName => {
      //this.snackbarService.showSnackbar(userName + "  has disconnected", null,3000);
      this.onlineUsers$.pipe(take(1)).subscribe(userNames => {
        this.onlineUsersSource.next([...userNames.filter(user => user !== userName)])
      });
    });

    this.hubConnection.on("GetOnlineUsers", ((userNames: string[]) => {
      this.onlineUsersSource.next(userNames);
    }));

    this.hubConnection.on("NewMessageReceied", ({ userName, knowAs }) => {
      const snackBarRef = this.snackbarService.showSnackbar(
        "",
        `${userName} has sent you a new message! Prees to to new message!`, // Action button label
        3000
      );
    
      snackBarRef.onAction().subscribe(() => {
        this.router.onSameUrlNavigation = "reload";
        this.router.navigate(['/members', knowAs, 'messages']);
      });
    });
    

  }

  stopHubConnection(){
    if(this.hubConnection){
      this.hubConnection.stop().catch(error => console.log(error));
    }
  }
}
