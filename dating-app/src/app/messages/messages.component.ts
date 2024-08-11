import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';  // Import MatTableDataSource
import { Message } from '../models/message.model';
import { PaginatedResult, Pagination } from '../models/pagination.model';
import { MessageService } from '../services/message.service';
import { PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatTabsModule,
    MatButtonModule,
    MatSortModule
  ],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  messages = new MatTableDataSource<Message>();  // Use MatTableDataSource
  pagination!: Pagination;
  container: string = 'Inbox';
  pageNumber: number = 1;
  pageSize = 5;
  displayedColumns: string[] = [
    'senderUserName',
    'recipientUserName',
    'content',
    'messageSent',
    'delete',
    'goToPrivateMessge'
  ];

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private messagesService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.messages.sort = this.sort;
    }
    if (this.paginator) {
      this.messages.paginator = this.paginator;
    }
  }

  // loadMessages(): void {
  //   this.messagesService
  //     .getMessages(this.pageNumber, this.pageSize, this.container)
  //     .subscribe((response: PaginatedResult<Message[]>) => {
  //       this.messages.data = response.result;
  //       this.pagination = response.pagination;
  //       if (this.sort) {
  //         this.sort.direction = 'asc';  // Default sort direction
  //       }
  //     });
  // }

  loadMessages(): void {
    this.messagesService
      .getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe((response: PaginatedResult<Message[]>) => {
        this.messages = new MatTableDataSource(response.result);
        this.pagination = response.pagination;
  
        if (this.paginator) {
          this.paginator.length = this.pagination.totalItems; 
          this.paginator.pageIndex = this.pageNumber - 1; 
          this.paginator.pageSize = this.pageSize;
        }
        
        if (this.sort) {
          this.messages.sort = this.sort; 
        }
      });
  }
  

  onPageChanged(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadMessages();
  }

  onTabChange(event: any): void {
    this.container = event.tab.textLabel;
    this.pageNumber = 1;
    this.loadMessages();
  }

  deleteMessage(id: number): void {
    this.messagesService.deleteMessage(id).subscribe(() => {
      this.loadMessages();
    });
  }

  goToMessage(message: Message): void {
    this.router.navigate(['/members', message.senderUserName, 'messages']);
  }
}
