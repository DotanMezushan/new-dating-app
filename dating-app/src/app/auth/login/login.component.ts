import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { LoginModel } from '../../models/login.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLoading = false;
  constructor(private authService : AuthService){
  }
  onSubmit(form : NgForm){
    this.isLoading = true;
    const login: LoginModel = {
      UserName: form.value.email,
      Password: form.value.password
    };
    this.authService.login(login).subscribe((res : any) => {
      console.log(res);
      this.isLoading = false;
      this.authService.navigateToHomePage();
    });
  }
}
