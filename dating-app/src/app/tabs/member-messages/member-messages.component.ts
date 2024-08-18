import { Component, Input, OnInit } from '@angular/core';
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
export default class MemberMessagesComponent implements OnInit {
  @Input() otherUserName!: string;

  //@Input() messages!: Message[]

  // messages: Message[] = [
  //   {
  //     id: 1,
  //     senderId: 101,
  //     senderUserName: 'JohnDoe',
  //     senderPhotoUrl: 'https://randomuser.me/api/portraits/men/18.jpg',
  //     RecipientId: 201,
  //     RecipientUserName: 'JaneDoe',
  //     RecipientPhotoUrl: 'https://res.cloudinary.com/dqoj32l1o/image/upload/v1722709958/ptahkx6f602obkkghv4e.jpg',
  //     content: 'Hey Jane, how are you?',
  //     dateRead: new Date('2024-08-06T12:00:00Z'),
  //     messageSent: new Date('2024-08-06T11:50:00Z'),
  //   },
  //   {
  //     id: 2,
  //     senderId: 201,
  //     senderUserName: 'JaneDoe',
  //     senderPhotoUrl: 'https://randomuser.me/api/portraits/men/18.jpg',
  //     RecipientId: 101,
  //     RecipientUserName: 'JohnDoe',
  //     RecipientPhotoUrl: 'https://res.cloudinary.com/dqoj32l1o/image/upload/v1722709958/ptahkx6f602obkkghv4e.jpg',
  //     content: 'Hi John, I am good, thanks! How about you?',
  //     dateRead: new Date('2024-08-06T12:05:00Z'),
  //     messageSent: new Date('2024-08-06T12:00:00Z'),
  //   },
  //   {
  //     id: 3,
  //     senderId: 101,
  //     senderUserName: 'JohnDoe',
  //     senderPhotoUrl: 'https://randomuser.me/api/portraits/men/18.jpg',
  //     RecipientId: 201,
  //     RecipientUserName: 'JaneDoe',
  //     RecipientPhotoUrl: 'https://res.cloudinary.com/dqoj32l1o/image/upload/v1722709958/ptahkx6f602obkkghv4e.jpg',
  //     content: 'I’m doing well! Are you free to catch up later?',
  //     messageSent: new Date('2024-08-06T12:10:00Z'),
  //   },
  //   {
  //     id: 4,
  //     senderId: 201,
  //     senderUserName: 'JaneDoe',
  //     senderPhotoUrl: 'https://randomuser.me/api/portraits/men/18.jpg',
  //     RecipientId: 101,
  //     RecipientUserName: 'JohnDoe',
  //     RecipientPhotoUrl: 'https://res.cloudinary.com/dqoj32l1o/image/upload/v1722709958/ptahkx6f602obkkghv4e.jpg',
  //     content: 'Sure, let’s meet at 5 PM.',
  //     messageSent: new Date('2024-08-06T12:15:00Z'),
  //   }
  // ];
  newMessageContent: string = '';

  constructor(
    public messageService: MessageService,
    private snackbarService: SnackbarService,
    // spinnerService
  ){
  }
  ngOnInit(): void {
    //this.messageService.createHubConnection(this.user, this.member.userName);
  }

  sendMessage(): void {
      this.messageService.sendMessage(this.otherUserName ,this.newMessageContent).then(()=>{
        this.newMessageContent ='';
      })
  }
}
