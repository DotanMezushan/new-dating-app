import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthService } from '../../services/auth.service';
import {LoginModel} from '../../models/login.model';
import {MatRadioModule} from '@angular/material/radio';



@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{
  constructor(
    public authService : AuthService
  ){

  }
  maxDate !: Date;
  isLoading = false;
  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form : NgForm){
    // let authData: AuthData = form.value;
    // this.authService.rgisterUser(authData);
    console.log(form.value);
    const signup: LoginModel = {
      UserName: form.value.email,
      Password: form.value.password
    };
    

    this.authService.register(form.value).subscribe((res : any) => {
      console.log(res);
      this.authService.navigateToHomePage();
    }, error => {
      console.log(error);
    });

  }

}
