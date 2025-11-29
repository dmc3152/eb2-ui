import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChristmasWrapper } from './christmas';

describe('Christmas', () => {
  let component: ChristmasWrapper;
  let fixture: ComponentFixture<ChristmasWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChristmasWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChristmasWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
