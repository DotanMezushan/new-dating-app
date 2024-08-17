import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr'
import { SnackbarService } from './snackbar.service';
import { UserResponse } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection!: HubConnection;
  constructor(
    private snackbarService : SnackbarService
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
      this.snackbarService.showSnackbar(userName + "  has connected", null,3000);
    });

    this.hubConnection.on("UserIsOffline", userName => {// same name as server!!!
      this.snackbarService.showSnackbar(userName + "  has disconnected", null,3000);
    });
  }

  stopHubConnection(){
    this.hubConnection.stop().catch(error => console.log(error));
  }
}
