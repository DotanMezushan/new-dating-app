import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';

export const routes: Routes = [
    {
        path: 'login',component : LoginComponent
    },
    {
        path: 'signup',component : SignupComponent
    },
    {
        path: 'members',component : MemberListComponent
    },
    {
        path: 'members/:id',component : MemberDetailComponent
    },
    {
        path: 'list',component : ListsComponent
    },
    {
        path: 'messages',component : MessagesComponent
    },
    {
        path: '',component : HomeComponent
    },
    {
        path: '**',
        component : HomeComponent,
        pathMatch: 'full'
    },
];
