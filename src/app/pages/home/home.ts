import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, RouterLink, MatListModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomePage {

}
