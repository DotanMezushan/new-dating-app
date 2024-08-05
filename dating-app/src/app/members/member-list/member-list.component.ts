import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Member } from '../../models/member.model';
import { MembersService } from '../../services/members.service';
import { CommonModule } from '@angular/common';
import { MemberCardComponent } from '../member-card/member-card.component';
import { Pagination } from '../../models/pagination.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserParams } from '../../models/userParams.model';
import { AuthService } from '../../services/auth.service';
import { UserResponse } from '../../models/login.model';
import { take } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [
    CommonModule,
    MemberCardComponent,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  members!: Member[];
  pagination: Pagination = new Pagination();
  user!: UserResponse;
  userParams!: UserParams;
  filterForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private membersService: MembersService,
  ) {
      this.userParams = this.membersService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  initializeForm(): void {
    this.filterForm = this.fb.group({
      gender: [this.userParams.gender],
      minAge: [this.userParams.minAge, [Validators.min(18)]],
      maxAge: [this.userParams.maxAge]
    }, { validators: [this.ageRangeValidator()] });
  }

  loadMembers(): void {
    this.membersService.setUserParams(this.userParams);
    this.membersService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
      this.initializeForm();
    });
  }

  onPageChanged(event: PageEvent): void {
    this.userParams.pageNumber = event.pageIndex + 1;
    this.userParams.pageSize = event.pageSize;
    this.membersService.setUserParams(this.userParams);
    this.loadMembers();
  }

  onFilter(): void {
    if (this.filterForm.valid) {
      this.userParams.gender = this.filterForm.get('gender')?.value;
      this.userParams.minAge = this.filterForm.get('minAge')?.value;
      this.userParams.maxAge = this.filterForm.get('maxAge')?.value;
      this.userParams.pageNumber = 1;
      this.membersService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }

  onFilterOrderBy(orderBy : string ): void {
    if (this.filterForm.valid) {
      this.userParams.gender = this.filterForm.get('gender')?.value;
      this.userParams.orderBy = orderBy;
      this.userParams.pageNumber = 1;
      this.membersService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }


  resetFilters(): void {
    this.userParams = this.membersService.resetUserParams();
    this.filterForm.reset({
      gender: this.userParams.gender,
      minAge: this.userParams.minAge,
      maxAge: this.userParams.maxAge
    });
    this.loadMembers();
  }

  ageRangeValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const minAge = group.get('minAge')?.value;
      const maxAge = group.get('maxAge')?.value;
      if (minAge && maxAge && maxAge <= minAge) {
        return { ageRangeCheck: true };
      }
      return null;
    };
  }
}
