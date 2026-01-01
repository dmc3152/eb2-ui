import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerScore } from './player-score';
import { BaseChartDirective } from 'ng2-charts';

describe('PlayerScore', () => {
  let component: PlayerScore;
  let fixture: ComponentFixture<PlayerScore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerScore],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerScore);
    fixture.componentRef.setInput('data', []);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
