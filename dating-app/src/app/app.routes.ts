import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { NgModule } from '@angular/core';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: 'login',component : LoginComponent
    },
    {
        path: 'signup',component : SignupComponent
    },
    {
        path: 'members',component : MemberListComponent , canActivate: [authGuard]
    },
    {
        path: 'members/:id',component : MemberDetailComponent , canActivate: [authGuard]
    },
    {
        path: 'list',component : ListsComponent , canActivate: [authGuard]
    },
    {
        path: 'messages',component : MessagesComponent , canActivate: [authGuard]
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

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
