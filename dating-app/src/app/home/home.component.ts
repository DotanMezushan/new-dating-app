import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(private snackbarService: SnackbarService){

  }
  ngOnInit(): void {
    this.snackbarService.showSnackbar("You must be logged in to access this page", null,3000);

  }

}
