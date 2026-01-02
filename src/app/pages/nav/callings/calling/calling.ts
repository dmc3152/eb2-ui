import { Component, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-calling',
  imports: [MatListModule, MatCardModule, MatButton, MatIcon, RouterLink, MatIconButton, MatExpansionModule],
  templateUrl: './calling.html',
  styleUrl: './calling.scss'
})
export class CallingPage {
  panel = signal(0);

  selectPanel(index: number) {
    this.panel.set(index);
  }

  assignCalling(event: Event) {
    event.stopPropagation();
  }
}
