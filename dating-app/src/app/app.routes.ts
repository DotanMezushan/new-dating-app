import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './guard/auth.guard';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './guard/prevent-unsaved-changes.guard';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { adminGuard } from './guard/admin.guard';

export const routes: Routes = [
    {
        path: 'login',component : LoginComponent
    },
    {
        path: 'signup',component : SignupComponent
    },
    {
        path: '',component : HomeComponent
    },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'members',component : MemberListComponent 
            },
            {
                path: 'members/:username',component : MemberDetailComponent 
            },
            {
                path: 'members/:username/messages', component: MemberDetailComponent
            },
            {
                path: 'member/edit',component : MemberEditComponent , 
                canActivate: [AuthGuard],canDeactivate: [preventUnsavedChangesGuard]
            },
            {
                path: 'list',component : ListsComponent ,
            },
            {
                path: 'messages',component : MessagesComponent , 
            },
            {
                path: 'admin',component : AdminPanelComponent , canActivate: [adminGuard] 
            }
        ]

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
