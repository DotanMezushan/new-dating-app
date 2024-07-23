import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackbar : MatSnackBar){}
  showSnackbar(message: string, action: any, duration:number ){
      this.snackbar.open(message, action, {
          duration: duration
      });
  }
}
