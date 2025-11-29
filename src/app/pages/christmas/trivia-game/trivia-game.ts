import { NgClass } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { TriviaGameService } from '@core/trivia-game';
import { TriviaAnswer, TriviaGameState, TriviaPlayerScore } from '@graphql';
import { ScoreDialog } from 'app/components/score-dialog/score-dialog';
import { firstValueFrom } from 'rxjs';
import { PlayerScore } from "app/components/player-score/player-score";
import { RingTimer } from 'app/components/ring-timer/ring-timer';

@Component({
  selector: 'app-trivia-game',
  imports: [MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatMenuModule, MatRadioModule, NgClass, RouterLink, PlayerScore, RingTimer],
  templateUrl: './trivia-game.html',
  styleUrl: './trivia-game.scss'
})
export class TriviaGame implements OnInit {
  private readonly triviaGame = inject(TriviaGameService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);
  readonly dialog = inject(MatDialog);

  @ViewChild('timer') timer!: RingTimer;

  constructor() {
    effect(() => {
      if (this.answerSubmitted()) {
        this.questionForm.controls.triviaAnswer.disable();
      }
    });

    effect(async () => {
      const currentState = this.gameState()?.state;
      if (!currentState && this.gameId()) {
        const playerName = this.triviaGame.authenticatedUser()?.name;
        if (playerName) {
          try {
            await this.triviaGame.changePlayerName(playerName);
          }
          catch (error) {
            this.snackbar.open("You got disconnected from the game. Please rejoin the game.", "Dismiss", { duration: 5000 });
            this.router.navigateByUrl('/christmas/join-trivia-game');
            return;
          }
        }
        else {
          this.snackbar.open("You got disconnected from the game. Please rejoin the game.", "Dismiss", { duration: 5000 });
          this.router.navigateByUrl('/christmas/join-trivia-game');
          return;
        }
      }

      switch (currentState) {
        case TriviaGameState.Question:
          this.questionForm.controls.triviaAnswer.enable();
          this.questionForm.reset();
          this.answerSubmitted.set(null);
          this.timer.reset();
          break;
        case TriviaGameState.Answer:
          this.questionForm.controls.triviaAnswer.disable();
          this.timer.reset();
          break;
        case TriviaGameState.Stopped:
        case TriviaGameState.Closed:
          this.router.navigateByUrl('/christmas/join-trivia-game');
          break;
        case TriviaGameState.Score:
          const scores = await this.getScore();
          if (Array.isArray(scores)) {
            this.playerScores.set(scores);
          }
          break;
        case TriviaGameState.Paused:
        case TriviaGameState.Splash:
          break;
      }
    });
  }

  authenticatedUser = this.triviaGame.authenticatedUser;
  playerScores = signal<TriviaPlayerScore[]>([]);
  
  questionForm = new FormGroup({
    triviaAnswer: new FormControl<TriviaAnswer | null>(null, Validators.required),
  });
  gameId = signal<string | null>(null);
  gameState = toSignal((this.triviaGame.joinGameAsPlayer()), { initialValue: null });
  answerSubmitted = signal<TriviaAnswer | null>(null);
  time = computed(() => {
    const time = this.gameState()?.time
    if (time) return time / 1000;
    return null;
  });

  ngOnInit(): void {
    this.getCurrentGame();
  }

  async submit() {
    const answer = this.questionForm.controls.triviaAnswer.value;
    if (!answer) return;

    const response = await firstValueFrom(this.triviaGame.submitAnswer(answer));
    if (response.success) {
      this.snackbar.open("Answer submitted", "Dismiss", { duration: 2500 });
      this.answerSubmitted.set(this.questionForm.controls.triviaAnswer.value);
    }
    else {
      this.snackbar.open("There was a problem submitting you answer. Please try again.", "Dismiss", { duration: 5000 });
    }
  }

  async getCurrentGame() {
    const gameId = await this.triviaGame.getCurrentGame();
    this.gameId.set(gameId || null)
  }

  async showScore() {
    const scores = await this.getScore();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '90vw';
    dialogConfig.data = scores;
    const dialogRef = this.dialog.open(ScoreDialog, dialogConfig);
  }

  async getScore() {
    return firstValueFrom(this.triviaGame.myScore());
  }
}
