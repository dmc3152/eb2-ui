import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardScore } from './board-score';

describe('BoardScore', () => {
  let component: BoardScore;
  let fixture: ComponentFixture<BoardScore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardScore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardScore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
