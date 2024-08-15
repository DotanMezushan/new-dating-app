import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { UserResponse } from '../../../models/login.model';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EditRoleDialogComponent } from '../../../dialogs/admin/edit-role-dialog/edit-role-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

const ELEMENT_DATA: UserResponse[] = [
  {userName: "aaaaaaaaaaa", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
  {userName: "bbbbbbbbb", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
  {userName: "cccccccccccc", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
  {userName: "ddddddddd", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
  {userName: "eeeeeeeeee", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
  {userName: "fffffffffffff", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
  {userName: "gggggggggg", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
  {userName: "hhhhhhhhhhhhhh", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
  {userName: "iiiiiiiiiiiiii", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
  {userName: "jjjjjjjjjjjjj", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
  {userName: "kkkkkkkkkkk", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
  {userName: "kkkkkkkkkkkk", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
  {userName: "lllllllllllll", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
  {userName: "llllmmmmmmmmmmmm", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
  {userName: "ooooooooo", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
  {userName: "ppppppppppppp", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
  {userName: "asasassa", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
  {userName: "cccccccccccc", roles: ["fklfdkl", "dihidshi"], token: "",photoUrl : "", knowAs: "",gender: ""},
];

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['userName', 'roles', 'edit'];
  dataSource = new MatTableDataSource<UserResponse>();
  private getUserssubscriptions!: Subscription;
  readonly dialog = inject(MatDialog);
    
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  ngOnDestroy(): void {
    if (this.getUserssubscriptions) {
      this.getUserssubscriptions.unsubscribe();
    }
  }

  getUsersWithRoles(): void {
    this.getUserssubscriptions = this.adminService.getUsersWithRoles()
    .subscribe((users: UserResponse[]) => {
      this.dataSource.data = users;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  editUser(user: UserResponse): void {
    const dialogRef = this.dialog.open(EditRoleDialogComponent, {
      data: {
        userName: user.userName,
        roles: user.roles
      },
      width: '400px',
      height: '200px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && !this.arraysEqual(result, user.roles as string[])) {
        this.adminService.updateUserRoles(user.userName as string, result)
          .subscribe(() => {
            this.getUsersWithRoles();
          });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  arraysEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();
    return sortedArr1.every((value, index) => value === sortedArr2[index]);
  }

}