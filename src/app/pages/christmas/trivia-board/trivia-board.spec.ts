import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriviaBoard } from './trivia-board';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('TriviaBoard', () => {
  let component: TriviaBoard;
  let fixture: ComponentFixture<TriviaBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriviaBoard, ApolloTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TriviaBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
