import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewsPage } from './interviews';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { provideRouter } from '@angular/router';

describe('InterviewsPage', () => {
  let component: InterviewsPage;
  let fixture: ComponentFixture<InterviewsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewsPage, ApolloTestingModule],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
