import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ScoreDialog } from './score-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('ScoreDialog', () => {
  let component: ScoreDialog;
  let fixture: ComponentFixture<ScoreDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreDialog],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: vi.fn()
          }
        },
        { provide: MAT_DIALOG_DATA, useValue: [] }
      ]
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
