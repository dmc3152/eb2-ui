import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Autocomplete, Option } from '../autocomplete/autocomplete';

export type AutocompleteDialogData = {
  title: string;
  actionText?: string;
  cancelText?: string;
  options: Option[];
};

@Component({
  selector: 'app-autocomplete-dialog',
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    Autocomplete
  ],
  templateUrl: './autocomplete-dialog.html',
  styleUrl: './autocomplete-dialog.scss',
})
export class AutocompleteDialog {
  readonly dialogRef = inject(MatDialogRef<AutocompleteDialog>);
  readonly data = inject<AutocompleteDialogData>(MAT_DIALOG_DATA);

  selectedOption = new FormControl(null, Validators.required);

  onCancel(): void {
    this.dialogRef.close();
  }
}
