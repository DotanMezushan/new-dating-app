import { Component, Input, ViewChild, ElementRef, EventEmitter, Output, HostListener } from '@angular/core';
import { Member } from '../../models/member.model';
import { MembersService } from '../../services/members.service';
import { Photo } from '../../models/photo.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '../../services/snackbar.service';
import { UserResponse } from '../../models/login.model';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss'],
})
export class PhotoEditorComponent {
  private readonly MOBILE_BREAKPOINT = 600;
  isMobileMode: boolean = false;
  user: UserResponse | null = new UserResponse();
  @Input() member!: Member;
  @Output() mainPhotoUrlChanged = new EventEmitter<string>();
  
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  isDragOver = false;

  constructor(
    private authService : AuthService,
    private membersService: MembersService,
    private snackbarService: SnackbarService
  ) {
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
    this.checkIfMobileMode();
  }

  deletePhoto(photo: Photo) {
    this.membersService.deletePhoto(photo.id).subscribe(() => {
      this.member.photos = this.member.photos.filter(p => p.id !== photo.id);
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length === 1) {
      const file = input.files[0];
      this.handleFile(file);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]); // Handle the first file only
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  private uploadFile(file: File) {
    this.membersService.uploadPhoto(file).subscribe((newPhoto) => {
      this.member.photos.push(newPhoto);
      this.fileInput.nativeElement.value = '';
    });
  }

  handleFile(file: File): void {
    const acceptedImageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];

    if (acceptedImageTypes.includes(file.type)) {
      this.uploadFile(file);
    } else {
      this.snackbarService.showSnackbar('Unsupported file type', null, 3000);
    }
  }

  setMainPhoto(photo: Photo){
    photo.isMain = true;
    this.membersService.setMainPhoto(photo.id).subscribe(()=>{
      if(this.user){
        this.user.photoUrl = photo.url;
      }
      this.authService.setCurrentUser(this.user as UserResponse);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p =>{
        if(p.isMain && p.id !== photo.id ){
          p.isMain = false;
        }
      })
      this.mainPhotoUrlChanged.emit(photo.url);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkIfMobileMode();
  }

  private checkIfMobileMode(): void {
    this.isMobileMode = window.innerWidth <= this.MOBILE_BREAKPOINT;
  }
}
