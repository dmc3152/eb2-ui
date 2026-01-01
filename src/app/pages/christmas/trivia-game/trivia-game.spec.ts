import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriviaGame } from './trivia-game';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { provideRouter } from '@angular/router';

describe('TriviaGame', () => {
  let component: TriviaGame;
  let fixture: ComponentFixture<TriviaGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriviaGame, ApolloTestingModule],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TriviaGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
