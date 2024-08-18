import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../models/member.model';
import {MatIconModule} from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MembersService } from '../../services/members.service';
import { SnackbarService } from '../../services/snackbar.service';
import { CommonModule } from '@angular/common';
import { PresenceService } from '../../services/presence.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss'
})
export class MemberCardComponent implements OnInit {
  constructor(
    private membersService: MembersService,
    private snackbarService: SnackbarService,
    private presenceService: PresenceService
  ){
    
  }
  ngOnInit(): void {
    this.presenceService.onlineUsers$.subscribe(onlineUsers => {
      this.isOnline = onlineUsers.includes(this.member.userName);
    });
  }
  @Input()
  member!: Member ;

  @Input()
  withIcons: boolean = true;

  isOnline = false;

  addLike(member: Member): void {
    this.membersService.addLike(member.userName).subscribe(()=>{
      this.snackbarService.showSnackbar("you like "+ member.knowAs,null,1000);
    });
  }
}
