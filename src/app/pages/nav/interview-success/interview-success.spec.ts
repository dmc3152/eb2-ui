import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewSuccessPage } from './interview-success';
import { provideRouter } from '@angular/router';

describe('InterviewSuccess', () => {
  let component: InterviewSuccessPage;
  let fixture: ComponentFixture<InterviewSuccessPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewSuccessPage],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
