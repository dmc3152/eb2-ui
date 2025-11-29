import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinTriviaGame } from './join-trivia-game';

describe('JoinTriviaGame', () => {
  let component: JoinTriviaGame;
  let fixture: ComponentFixture<JoinTriviaGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinTriviaGame]
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
