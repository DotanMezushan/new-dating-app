import { Component, OnDestroy, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Member } from '../../models/member.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {MatTabChangeEvent, MatTabsModule} from '@angular/material/tabs';
import { PhotoGalleryComponent } from "../../tabs/photo-gallry/photo-gallry.component";
import { MomentModule } from 'ngx-moment';
import MemberMessagesComponent from '../../tabs/member-messages/member-messages.component';
import { PresenceService } from '../../services/presence.service';
import { Message } from '../../models/message.model';
import { MessageService } from '../../services/message.service';
import { UserResponse } from '../../models/login.model';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';


@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatTabsModule,
    MomentModule,
    PhotoGalleryComponent,
    MemberMessagesComponent,
  ],
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  member!: Member ;
  messages!: Message[];
  currentPhotoIndex = 0;
  currentPhotoUrl = '';
  imagesUrl: string[] = [];
  selectedTabIndex = 0;
  isOnline = false;
  userName !: string;
  user!: UserResponse;

  constructor(
    private membersService: MembersService,
    private route: ActivatedRoute,
    private presenceService: PresenceService,
    private messageService : MessageService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user as UserResponse;
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.loadMember();
    this.presenceService.onlineUsers$.subscribe(onlineUsers => {
      if(this.member && this.member.userName){
        this.isOnline = onlineUsers.includes(this.member.userName);
      }
    });
  }

  loadMember(): void {
    this.userName = this.route.snapshot.paramMap.get('username') as string;
    if (this.userName) {
      this.membersService.getMemberByName(this.userName).subscribe((member) => {
        this.member = member;
        this.checkForSelectedTab();
        this.setimagesUrl();
        if (
          this.member &&
          this.member.photos &&
          this.member.photos.length > 0
        ) {
          this.currentPhotoUrl = this.member.photos[this.currentPhotoIndex].url;
        }
      });
    }
  }

  checkForSelectedTab(): void {
    if (
      this.route.snapshot.url.some((segment) => segment.path === 'messages')
    ) {
      this.selectedTabIndex = 3;
      this.messageService.createHubConnection(this.user, this.member.userName);
    }
  }

  previousPhoto() {
    if (this.member && this.member.photos && this.member.photos.length > 0) {
      this.currentPhotoIndex =
        (this.currentPhotoIndex - 1 + this.member.photos.length) %
        this.member.photos.length;
      this.currentPhotoUrl = this.member.photos[this.currentPhotoIndex].url;
    }
  }

  nextPhoto() {
    if (this.member && this.member.photos && this.member.photos.length > 0) {
      this.currentPhotoIndex =
        (this.currentPhotoIndex + 1) % this.member.photos.length;
      this.currentPhotoUrl = this.member.photos[this.currentPhotoIndex].url;
    }
  }

  likeMember() {
    console.log('Like button clicked');
  }

  messageMember() {
    console.log('Message button clicked');
  }

  setimagesUrl(): void {
    if (this.member && this.member.photos && this.member.photos.length) {
      for (let i = 0; i < this.member.photos.length; i++) {
        this.imagesUrl.push(this.member.photos[i].url);
      }
    }
  }

  loadMessages(): void {
    this.messageService.getMessageThead(this.userName).subscribe((message: Message[]) => {
      if(message && message.length){
        this.messages = message;
      }
    });
  }

  onTabActive(event: MatTabChangeEvent): void {
    const tabIndex = event.index;
    //const tabLabel = event.tab.textLabel;

     if (tabIndex === 3) {
      this.messageService.createHubConnection(this.user, this.member.userName);
    }else{
      this.messageService.stopHubConnection();
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}
