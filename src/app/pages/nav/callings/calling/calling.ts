import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import { CallingsService } from '@pages/nav/callings/callingsService';
import { CallingFragment } from '@graphql';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AutocompleteDialog, AutocompleteDialogData } from 'app/components/autocomplete-dialog/autocomplete-dialog';

@Component({
  selector: 'app-calling',
  imports: [MatListModule, MatCardModule, MatButton, MatIcon, RouterLink, MatIconButton, MatExpansionModule],
  templateUrl: './calling.html',
  styleUrl: './calling.scss'
})
export class CallingPage implements OnInit {
  private readonly callingsService = inject(CallingsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  callingId = input.required<string>();
  panel = signal(0);
  calling = signal<CallingFragment | null>(null);

  ngOnInit(): void {
    this.callingsService.callingById(this.callingId()).subscribe({
      next: (calling) => {
        this.calling.set(calling);
      },
      error: (error) => {
        if(error instanceof Error) {
          console.error('Error loading calling', error.message);
        }
        this.snackBar.open(`There was a problem loading ${this.callingId()}`, 'Dismiss', { duration: 5000 });
      }
    })
  }

  selectPanel(index: number) {
    this.panel.set(index);
  }

  updateCallingName() {
    
  }

  assignCalling() {
    const dialogRef = this.dialog.open<AutocompleteDialog, AutocompleteDialogData>(AutocompleteDialog, {
      data: {
        title: "Assign Calling to User",
        actionText: "Assign Calling",
        cancelText: "Cancel",
        options: [
          { text: 'Option 1', value: 'option-1' },
          { text: 'Thing 2', value: 'thing-2' },
        ]
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  assignPermission() {
    const dialogRef = this.dialog.open<AutocompleteDialog, AutocompleteDialogData>(AutocompleteDialog, {
      data: {
        title: "Add Permission",
        actionText: "Add Permission",
        cancelText: "Cancel",
        options: [
          { text: 'Option 1', value: 'option-1' },
          { text: 'Thing 2', value: 'thing-2' },
        ]
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  removeCalling() {

  }

  removePermission() {

  }
}
