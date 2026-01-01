import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordPage } from './reset-password';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { provideRouter } from '@angular/router';

describe('ResetPasswordPage', () => {
  let component: ResetPasswordPage;
  let fixture: ComponentFixture<ResetPasswordPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordPage, ApolloTestingModule],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
