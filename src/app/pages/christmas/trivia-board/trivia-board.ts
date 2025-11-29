import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgClass } from '@angular/common';
import { Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { TriviaGameService } from '@core/trivia-game';
import { TriviaGameScore, TriviaGameState } from '@graphql';
import { QRCodeComponent } from 'angularx-qrcode';
import { BoardScore } from 'app/components/board-score/board-score';
import { Carousel } from 'app/components/carousel/carousel';
import { RingTimer } from 'app/components/ring-timer/ring-timer';
import { concat, delay, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-trivia-board',
  imports: [MatCardModule, NgClass, QRCodeComponent, RingTimer, BoardScore, Carousel, CdkStepperModule],
  templateUrl: './trivia-board.html',
  styleUrl: './trivia-board.scss'
})
export class TriviaBoard {
  private readonly triviaGame = inject(TriviaGameService);
  
  @ViewChild('timer') timer!: RingTimer;

  constructor() {
    effect(() => {
      const state = this.gameState()?.state;
      if (!state) return;

      switch (state) {
        case TriviaGameState.Question:
        case TriviaGameState.Answer:
          if (this.timer) this.timer.reset();
          break;
        case TriviaGameState.Score:
          const scores = this.gameState()?.scores;
          if (!scores) break;

          const aggregatedScoresByPlayer = scores.reduce((acc, score) => {
            score.scores.forEach(playerScore => {
              const entry = acc.get(playerScore.playerName);
              if (entry) {
                acc.set(entry.playerName, { ...entry, score: entry.score + playerScore.score });
              }
              else {
                acc.set(playerScore.playerName, playerScore);
              }
            })
            return acc;
          }, new Map<string, NonNullable<typeof scores>[0]['scores'][0]>())

          scores.unshift({
            category: "Total Score",
            scores: Array.from(aggregatedScoresByPlayer.values())
          })
          this.boardScores.set(scores);
          break;
      }
    })
  }

  boardScores = signal<TriviaGameScore[] | null>(null);

  time = computed(() => {
    const time = this.gameState()?.time;
    if (time) return time / 1000;
    return null;
  });

  private enterAnimations = [
    { value: 'snowflake-drop', delay: 500 },
    { value: 'wreath-spin-in', delay: 600 },
    { value: 'chimney-fade-in', delay: 600 },
    { value: 'jingle-shake', delay: 500 },
  ];
  enterAnimation = signal<string>('snowflake-drop');

  gameState = toSignal((this.triviaGame.joinGameAsBoard().pipe(
    switchMap(newValue => {
      // 1. Define the first event (emits immediately)
      const immediateEvent$ = of(null);

      // 2. Define the delayed event
      let delayDuration = 0;
      if (newValue?.state === 'QUESTION') {
        const index = Math.floor(Math.random() * this.enterAnimations.length);
        this.enterAnimation.set(this.enterAnimations[index].value);
        delayDuration = this.enterAnimations[index].delay;
      }
      const delayedEvent$ = of(newValue).pipe(delay(delayDuration));

      // 3. Concatenate them to run sequentially
      return concat(immediateEvent$, delayedEvent$);
    })
  )), { initialValue: null });
}
