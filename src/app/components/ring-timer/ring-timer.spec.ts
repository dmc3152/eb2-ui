import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RingTimer } from './ring-timer';

describe('RingTimer', () => {
  let component: RingTimer;
  let fixture: ComponentFixture<RingTimer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RingTimer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RingTimer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
