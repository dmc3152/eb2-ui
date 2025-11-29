import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog'
import { TriviaPlayerScore } from '@graphql';
import { PlayerScore } from "../player-score/player-score";

@Component({
  selector: 'app-score-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, PlayerScore],
  templateUrl: './score-dialog.html',
  styleUrl: './score-dialog.scss'
})
export class ScoreDialog {
  readonly dialogRef = inject(MatDialogRef<ScoreDialog>);
  readonly data = inject<TriviaPlayerScore[]>(MAT_DIALOG_DATA);

  close = () => {
    this.dialogRef.close();
  }
}
