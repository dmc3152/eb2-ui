import { inject, Injectable, signal } from '@angular/core';
import { ChangeMyTriviaPlayerNameGQL, CloseTriviaGameGQL, CreateTriviaGameGQL, CurrentGameGQL, JoinTriviaGameAsAdminGQL, JoinTriviaGameAsBoardGQL, JoinTriviaGameAsPlayerGQL, MyTriviaScoreGQL, NextTriviaQuestionGQL, PauseTriviaGameGQL, ResumeTriviaGameGQL, ShowScoreAfterQuestionGQL, ShowScoreImmediatelyGQL, StartTriviaGameGQL, StopTriviaGameGQL, SubmitTriviaAnswerGQL, TriviaAnswer, TriviaGameErrorCodes, TriviaGamePayload, TriviaGameUpdateForBoard } from '@graphql';
import { catchError, firstValueFrom, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TriviaGameService {
  private readonly submitTriviaAnswerGql = inject(SubmitTriviaAnswerGQL);
  private readonly joinTriviaGameAsPlayerGql = inject(JoinTriviaGameAsPlayerGQL);
  private readonly joinTriviaGameAsAdminGql = inject(JoinTriviaGameAsAdminGQL);
  private readonly joinTriviaGameAsBoardGql = inject(JoinTriviaGameAsBoardGQL);
  private readonly currentGameGql = inject(CurrentGameGQL);
  private readonly changeMyTriviaPlayerNameGql = inject(ChangeMyTriviaPlayerNameGQL);
  private readonly myTriviaScoreGql = inject(MyTriviaScoreGQL);
  private readonly createTriviaGameGql = inject(CreateTriviaGameGQL);
  private readonly startTriviaGameGql = inject(StartTriviaGameGQL);
  private readonly nextTriviaQuestionGql = inject(NextTriviaQuestionGQL);
  private readonly pauseTriviaGameGql = inject(PauseTriviaGameGQL);
  private readonly resumeTriviaGameGql = inject(ResumeTriviaGameGQL);
  private readonly closeTriviaGameGql = inject(CloseTriviaGameGQL);
  private readonly stopTriviaGameGql = inject(StopTriviaGameGQL);
  private readonly showScoreAfterQuestionGql = inject(ShowScoreAfterQuestionGQL);
  private readonly showScoreImmediatelyGql = inject(ShowScoreImmediatelyGQL);

  private _authenticatedUser = signal<{ name: string } | null>(null);
  authenticatedUser = this._authenticatedUser.asReadonly();

  getCurrentGame = async () => {
    return firstValueFrom(this.currentGameGql.fetch(undefined, { fetchPolicy: 'network-only' }).pipe(map(x => x.data.currentGame?.id)));
  }

  joinGameAsPlayer = () => {
    return this.joinTriviaGameAsPlayerGql.subscribe()
      .pipe(
        map(x => x.data?.joinTriviaGameAsPlayer || null),
        catchError(x => of(null))
      );
  }

  joinGameAsAdmin = () => {
    return this.joinTriviaGameAsAdminGql.subscribe()
      .pipe(
        map(x => x.data?.joinTriviaGameAsAdmin || null),
        catchError(x => of(null))
      );
  }

  joinGameAsBoard = () => {
    return this.joinTriviaGameAsBoardGql.subscribe()
      .pipe(
        map(x => x.data?.joinTriviaGameAsBoard || null),
        catchError(x => of(null))
      );
  }

  changePlayerName = async (newName: string) => {
    try {
      await firstValueFrom(this.changeMyTriviaPlayerNameGql.mutate({ newName }));
      this._authenticatedUser.set({ name: newName });
    }
    catch (err) {
      throw err;
    }
  }

  myScore = () => {
    return this.myTriviaScoreGql.fetch(undefined, { fetchPolicy: 'network-only' }).pipe(
      map(x => x.data.myTriviaScore),
      map(this.generalIssue),
      catchError(this.generalError)
    );
  }

  submitAnswer = (answer: TriviaAnswer) => {
    return this.submitTriviaAnswerGql.mutate({ answer })
      .pipe(
        map(x => x.data?.submitTriviaAnswer),
        map(this.generalIssue),
        catchError(this.generalError)
      );
  }

  createGame = (gameId: string) => {
    return this.createTriviaGameGql.mutate({ gameId })
      .pipe(
        map(x => x.data?.createTriviaGame),
        map(this.generalIssue),
        catchError(this.generalError)
      );
  }

  startGame = (gameId: string) => {
    return this.startTriviaGameGql.mutate({ gameId })
      .pipe(
        map(x => x.data?.startTriviaGame),
        map(this.generalIssue),
        catchError(this.generalError)
      );
  }

  nextQuestion = () => {
    return this.nextTriviaQuestionGql.mutate()
      .pipe(
        map(x => x.data?.nextTriviaQuestion),
        map(this.generalIssue),
        catchError(this.generalError)
      );
  }

  pauseGame = () => {
    return this.pauseTriviaGameGql.mutate()
      .pipe(
        map(x => x.data?.pauseTriviaGame),
        map(this.generalIssue),
        catchError(this.generalError)
      );
  }

  resumeGame = () => {
    return this.resumeTriviaGameGql.mutate()
      .pipe(
        map(x => x.data?.resumeTriviaGame),
        map(this.generalIssue),
        catchError(this.generalError)
      );
  }

  closeGame = () => {
    return this.closeTriviaGameGql.mutate()
      .pipe(
        map(x => x.data?.closeTriviaGame),
        map(this.generalIssue),
        catchError(this.generalError)
      );
  }

  stopGame = () => {
    return this.stopTriviaGameGql.mutate()
      .pipe(
        map(x => x.data?.stopTriviaGame),
        map(this.generalIssue),
        catchError(this.generalError)
      );
  }

  showScoreAfterQuestion = () => {
    return this.showScoreAfterQuestionGql.mutate()
      .pipe(
        map(x => x.data?.showScoreAfterQuestion),
        map(this.generalIssue),
        catchError(this.generalError)
      );
  }

  showScoreImmediately = () => {
    return this.showScoreImmediatelyGql.mutate()
      .pipe(
        map(x => x.data?.showScoreImmediately),
        map(this.generalIssue),
        catchError(this.generalError)
      );
  }

  private generalIssue = <T>(value: T) => !value ? this.genericUnknownError() : value;
  private generalError = <T>(error: T) => of(this.genericUnknownError());

  private genericUnknownError = (): TriviaGamePayload => {
    return {
      success: false,
      error: {
        code: TriviaGameErrorCodes.UnknownError,
        message: "There was a problem"
      }
    };
  }
}
