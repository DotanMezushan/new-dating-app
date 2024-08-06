import { Component, Input } from '@angular/core';
import { Member } from '../../models/member.model';
import {MatIconModule} from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MembersService } from '../../services/members.service';
import { SnackbarService } from '../../services/snackbar.service';
import { CommonModule } from '@angular/common';

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
export class MemberCardComponent {
  constructor(
    private membersService: MembersService,
    private snackbarService: SnackbarService,
  ){
    
  }
  @Input()
  member: Member | undefined;

  @Input()
  withIcons: boolean = true;

  addLike(member: Member): void {
    this.membersService.addLike(member.userName).subscribe(()=>{
      this.snackbarService.showSnackbar("you like "+ member.knowAs,null,1000);
    });
  }
}
