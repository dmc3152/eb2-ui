import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEmailPage } from './verify-email';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { provideRouter } from '@angular/router';

describe('VerifyEmail', () => {
  let component: VerifyEmailPage;
  let fixture: ComponentFixture<VerifyEmailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyEmailPage, ApolloTestingModule],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
