import { Component, OnInit, ViewChild } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';
import { Member } from '../../models/member.model';
import { UserResponse } from '../../models/login.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { PhotoGalleryComponent } from '../../tabs/photo-gallry/photo-gallry.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRipple, MatRippleModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SnackbarService } from '../../services/snackbar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PhotoEditorComponent } from "../../tabs/photo-editor/photo-editor.component";

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatTabsModule,
    PhotoGalleryComponent,
    ReactiveFormsModule,
    MatRippleModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    PhotoEditorComponent
],
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss'],
})
export class MemberEditComponent implements OnInit {
  @ViewChild(MatRipple) ripple!: MatRipple;
  member: Member | undefined;
  currentPhotoIndex = 0;
  currentPhotoUrl = '';
  imagesUrl: string[] = [];
  user: UserResponse | undefined;
  memberForm!: FormGroup;
  isLoading = false;

  constructor(
    private membersService: MembersService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackbarService: SnackbarService,
  ) {
    this.authService.currentUser$
      .pipe(take(1))
      .subscribe((user: any) => (this.user = user));
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(): void {
    let userName: string;
    if (this.user && this.user.userName) {
      userName = this.user.userName;
      this.membersService
        .getMemberByName(userName)
        .subscribe((member: Member) => {
          this.member = member;
          this.currentPhotoUrl = this.member.photoUrl;
          this.initializeForm();
        });
    } else {
      console.log('no user name, loadMember member-edit.component.ts');
    }
    this.isLoading = false;
  }

  previousPhoto() {
    if (this.member && this.member.photos && this.member.photos.length > 0) {
      this.currentPhotoIndex =
        (this.currentPhotoIndex - 1 + this.member.photos.length) %
        this.member.photos.length;
      this.currentPhotoUrl = this.member.photos[this.currentPhotoIndex].url;
    }
  }

  nextPhoto() {
    if (this.member && this.member.photos && this.member.photos.length > 0) {
      this.currentPhotoIndex =
        (this.currentPhotoIndex + 1) % this.member.photos.length;
      this.currentPhotoUrl = this.member.photos[this.currentPhotoIndex].url;
    }
  }

  initializeForm() {
    this.memberForm = this.fb.group({
      // userName: ['', Validators.required],
      // photoUrl: [''],
      // age: ['', Validators.required],
      // knowAs: [''],
      introduction: [''],
      lookingFor: [''],
      interests: [''],
      city: [''],
      country: [''],
    });
    if (this.member) {
      this.memberForm.patchValue(this.member as any);
      this.memberForm.valueChanges.subscribe((value: any) => {
        this.launchRipple(); 
      });
    }
  }

  saveChanges() {
    if (this.memberForm.valid) {
      const editedMember: Member = this.memberForm.getRawValue();
      this.membersService.updateMember(editedMember).subscribe(()=>{
        this.snackbarService.showSnackbar("פרופיל עודכן", null,3000);
        this.loadMember();
      });

      // Handle form submission, e.g., send editedMember to your API
      //this.launchRipple();
    }
  }

  launchRipple() {
    const rippleRef = this.ripple.launch({
      persistent: true,
      centered: true,
      animation: {
        enterDuration: 500,
        exitDuration: 1500  
      }
    });
    rippleRef.fadeOut();
  }

  onMainPhotoUrlChanged( newUrl: string) {
    this.currentPhotoUrl = newUrl;
  }
  
  
}
