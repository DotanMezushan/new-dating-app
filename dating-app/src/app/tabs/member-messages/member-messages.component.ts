import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from '../../models/message.model';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MomentModule } from 'ngx-moment';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [
    CommonModule,
     FormsModule, 
     MatCardModule,
     MatFormFieldModule,
     MatInputModule,
     MatIconModule,
     MatButtonModule,
     MomentModule
    ], 
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export default class MemberMessagesComponent implements OnInit, AfterViewChecked  {
  @Input() otherUserName!: string;
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  newMessageContent: string = '';

  constructor(
    public messageService: MessageService,
    private snackbarService: SnackbarService,
    // spinnerService
  ){
  }
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  ngOnInit(): void {
    //this.messageService.createHubConnection(this.user, this.member.userName);
  }

  sendMessage(): void {
      this.messageService.sendMessage(this.otherUserName ,this.newMessageContent).then(()=>{
        this.newMessageContent ='';
      })
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Could not scroll to bottom:', err);
    }
  }
}
