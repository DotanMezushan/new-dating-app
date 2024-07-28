import { Component, Input } from '@angular/core';
import { Member } from '../../models/member.model';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss'
})
export class MemberCardComponent {
  @Input()
  member: Member | undefined;
}
