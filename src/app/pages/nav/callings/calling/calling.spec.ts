import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallingPage } from './calling';

describe('Calling', () => {
  let component: CallingPage;
  let fixture: ComponentFixture<CallingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallingPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
