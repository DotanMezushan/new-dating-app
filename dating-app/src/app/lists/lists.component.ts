import { Component, OnInit } from '@angular/core';
import { MembersService } from '../services/members.service';
import { SnackbarService } from '../services/snackbar.service';
import { Member } from '../models/member.model';
import { Pagination } from '../models/pagination.model';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MemberCardComponent } from '../members/member-card/member-card.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [
    MatTabsModule,
    CommonModule,
    MemberCardComponent,
    MatPaginatorModule,
  ],
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  membersILike: Member[] = [];
  membersLikeBy: Member[] = [];
  pageNumberILike: number = 1;
  pageSizeILike: number = 5;
  paginationILike!: Pagination;
  pageNumberLikeBy: number = 1;
  pageSizeLikeBy: number = 5;
  paginationLikeBy!: Pagination;

  constructor(
    private membersService: MembersService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.loadLikes('liked');
    this.loadLikes('likeBy');
  }

  loadLikes(predicate: string) {
    const pageNumber = predicate === 'liked' ? this.pageNumberILike : this.pageNumberLikeBy;
    const pageSize = predicate === 'liked' ? this.pageSizeILike : this.pageSizeLikeBy;
    this.membersService.getLikes(predicate, pageNumber, pageSize).subscribe(
      (response: any) => {
        if (predicate === 'liked') {
          this.membersILike = response.result;
          this.paginationILike = response.pagination;
        } else if (predicate === 'likeBy') {
          this.membersLikeBy = response.result;
          this.paginationLikeBy = response.pagination;
        }
      },
      error => {
        this.snackbarService.showSnackbar('Failed to load likes', null, 3000);
      }
    );
  }

  onPageChanged(event: PageEvent, predicate: string): void {
    if (predicate === 'liked') {
      this.pageNumberILike = event.pageIndex + 1;
      this.pageSizeILike = event.pageSize;
    } else if (predicate === 'likeBy') {
      this.pageNumberLikeBy = event.pageIndex + 1;
      this.pageSizeLikeBy = event.pageSize;
    }
    this.loadLikes(predicate);
  }
}
