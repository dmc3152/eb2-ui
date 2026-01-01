import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinTriviaGame } from './join-trivia-game';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { provideRouter } from '@angular/router';

describe('JoinTriviaGame', () => {
  let component: JoinTriviaGame;
  let fixture: ComponentFixture<JoinTriviaGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinTriviaGame, ApolloTestingModule],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinTriviaGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
