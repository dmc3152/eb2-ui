import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallingsPage } from './callings';

describe('Users', () => {
  let component: CallingsPage;
  let fixture: ComponentFixture<CallingsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallingsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
