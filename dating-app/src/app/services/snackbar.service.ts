import { Injectable } from '@angular/core';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackbar : MatSnackBar){}
  showSnackbar(message: string, action: any, duration:number ): MatSnackBarRef<SimpleSnackBar>{
      return this.snackbar.open(message, action, {
      duration: duration
    });
  }
}
