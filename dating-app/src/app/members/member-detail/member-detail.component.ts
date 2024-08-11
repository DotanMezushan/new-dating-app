import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Member } from '../../models/member.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import { PhotoGalleryComponent } from "../../tabs/photo-gallry/photo-gallry.component";
import { MomentModule } from 'ngx-moment';
import MemberMessagesComponent from '../../tabs/member-messages/member-messages.component';


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
export class MemberDetailComponent implements OnInit {
  member: Member | undefined;
  currentPhotoIndex = 0;
  currentPhotoUrl = '';
  imagesUrl: string[] = [];
  selectedTabIndex = 0;

  constructor(
    private membersService: MembersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadMember();
    this.checkForSelectedTab();
  }

  loadMember(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.membersService.getMemberByName(username).subscribe((member) => {
        this.member = member;
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
}
