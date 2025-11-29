import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { TriviaGameService } from '@core/trivia-game';
import { RingTimer } from 'app/components/ring-timer/ring-timer';

@Component({
  selector: 'app-join-trivia-game',
  imports: [MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatMenuModule, MatIconModule, RouterLink, RingTimer],
  templateUrl: './join-trivia-game.html',
  styleUrl: './join-trivia-game.scss'
})
export class JoinTriviaGame implements OnInit {
  private readonly triviaGame = inject(TriviaGameService);
  private readonly router = inject(Router);
  private readonly snackbar = inject(MatSnackBar);

  triviaJoinForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  gameId = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  async submit() {
    const name = this.triviaJoinForm.controls.name.value;
    if (!name) return;

    try {
      await this.triviaGame.changePlayerName(name);
      this.router.navigateByUrl('christmas/trivia-game');
    }
    catch (error) {
      this.snackbar.open("There was a problem joining the game", "Dismiss", { duration: 5000 });
    }
  }

  async refresh() {
    const gameId = await this.triviaGame.getCurrentGame();
    this.gameId.set(gameId || null)
  }
}
