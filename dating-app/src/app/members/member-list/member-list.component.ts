import { Component, OnInit } from '@angular/core';
import { Member } from '../../models/member.model';
import { MembersService } from '../../services/members.service';
import { CommonModule } from '@angular/common';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, MemberCardComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit {
  members : Member[] = [];

  constructor(
    public membersService: MembersService
  ){

  }
  ngOnInit(): void {
    this.membersService.getMembers().subscribe(members => {
      this.members = members;
      console.log(this.members);
    })
  }

}
