import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupPage } from './signup';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { provideRouter } from '@angular/router';

describe('Signup', () => {
  let component: SignupPage;
  let fixture: ComponentFixture<SignupPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupPage, ApolloTestingModule],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
