import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule, MatButtonModule,],
  templateUrl: './photo-gallry.component.html',
  styleUrls: ['./photo-gallry.component.scss']
})
export class PhotoGalleryComponent {
  @Input() imagesUrl: string[] | undefined;

  currentIndex: number = 0;

  get currentImage(): string | undefined {
    return this.imagesUrl ? this.imagesUrl[this.currentIndex] : undefined;
  }

  previousImage(): void {
    if (this.imagesUrl && this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextImage(): void {
    if (this.imagesUrl && this.currentIndex < this.imagesUrl.length - 1) {
      this.currentIndex++;
    }
  }
}
