import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TriviaGameService } from '@core/trivia-game';
import { firstValueFrom, of } from 'rxjs';

@Component({
  selector: 'app-trivia-admin',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './trivia-admin.html',
  styleUrl: './trivia-admin.scss'
})
export class TriviaAdmin implements OnInit {
  private readonly triviaGame = inject(TriviaGameService);
  private readonly snackbar = inject(MatSnackBar);

  constructor() {
    effect(() => {
      const state = this.gameState.value()?.state;
      if (!state) {
        this.gameId.set(null);
      }
    })
  }

  gameId = signal<string | null>(null);
  // gameState = toSignal((this.triviaGame.joinGameAsAdmin()), { initialValue: null });
  gameState = rxResource({
    params: () => this.gameId(),
    stream: ({ params }) => !params ? of(undefined) : this.triviaGame.joinGameAsAdmin(),
  });
  createGameForm = new FormGroup({
    gameId: new FormControl('', Validators.required),
  });
  startGameForm = new FormGroup({
    gameId: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.getCurrentGame();
  }

  async createGame() {
    const gameId = this.createGameForm.controls.gameId.value;
    if (!gameId) return;

    const result = await firstValueFrom(this.triviaGame.createGame(gameId));
    if (result.success) {
      this.snackbar.open("Created game successfully!", "Dismiss", { duration: 2500 });
      return;
    };

    if (result.error?.code === 'GAME_ALREADY_EXISTS') {
      this.snackbar.open(`A game with ID "${gameId}" already exists`, "Dismiss", { duration: 5000 });
    }
    else {
      this.snackbar.open("There was a problem creating the game", "Dismiss", { duration: 5000 });
    }
  }

  async startGame() {
    const gameId = this.startGameForm.controls.gameId.value;
    if (!gameId) {
      this.snackbar.open("Started game successfully!", "Dismiss", { duration: 2500 });
      return;
    }

    const result = await firstValueFrom(this.triviaGame.startGame(gameId));
    if (result.success) {
      this.gameId.set(gameId);
      return;
    }

    this.snackbar.open("There was a problem starting the game", "Dismiss", { duration: 5000 });
  }

  async nextQuestion() {
    const result = await firstValueFrom(this.triviaGame.nextQuestion());
    if (result.success) {
      this.snackbar.open("Queued next question successfully!", "Dismiss", { duration: 2500 });
      return;
    }

    this.snackbar.open("There was a problem queueing the next question", "Dismiss", { duration: 5000 });
  }

  async pauseGame() {
    const result = await firstValueFrom(this.triviaGame.pauseGame());
    if (result.success) {
      this.snackbar.open("Paused game successfully!", "Dismiss", { duration: 2500 });
      return;
    }

    this.snackbar.open("There was a problem pausing the game", "Dismiss", { duration: 5000 });
  }

  async resumeGame() {
    const result = await firstValueFrom(this.triviaGame.resumeGame());
    if (result.success) {
      this.snackbar.open("Resumed game successfully!", "Dismiss", { duration: 2500 });
      return;
    }

    this.snackbar.open("There was a problem resuming the game", "Dismiss", { duration: 5000 });
  }

  async showScoreAfterQuestion() {
    const result = await firstValueFrom(this.triviaGame.showScoreAfterQuestion());
    if (result.success) {
      this.snackbar.open("Scheduled score after question successfully!", "Dismiss", { duration: 2500 });
      return;
    }

    this.snackbar.open("There was a problem resuming the game", "Dismiss", { duration: 5000 });
  }

  async showScoreImmediately() {
    const result = await firstValueFrom(this.triviaGame.showScoreImmediately());
    if (result.success) {
      this.snackbar.open("Showing score successfully!", "Dismiss", { duration: 2500 });
      return;
    }

    this.snackbar.open("There was a problem resuming the game", "Dismiss", { duration: 5000 });
  }

  async closeGame() {
    const result = await firstValueFrom(this.triviaGame.closeGame());
    if (result.success) {
      this.gameId.set(null);
      this.snackbar.open("Closed game successfully!", "Dismiss", { duration: 2500 });
      return;
    }

    this.snackbar.open("There was a problem closing the game", "Dismiss", { duration: 5000 });
  }

  async stopGame() {
    const result = await firstValueFrom(this.triviaGame.stopGame());
    if (result.success) {
      this.gameId.set(null);
      this.snackbar.open("Stopped game successfully!", "Dismiss", { duration: 2500 });
      return;
    }

    this.snackbar.open("There was a problem stopping the game", "Dismiss", { duration: 5000 });
  }

  async getCurrentGame() {
    const gameId = await this.triviaGame.getCurrentGame();
    this.gameId.set(gameId || null)
  }
}
