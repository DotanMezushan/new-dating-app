import { Component, Input } from '@angular/core';
import { Member } from '../../models/member.model';
import {MatIconModule} from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss'
})
export class MemberCardComponent {
  constructor(){
    
  }
  @Input()
  member: Member | undefined;
}
