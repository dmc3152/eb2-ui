import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreDialog } from './score-dialog';

describe('ScoreDialog', () => {
  let component: ScoreDialog;
  let fixture: ComponentFixture<ScoreDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
