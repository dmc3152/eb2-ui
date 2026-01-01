import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPage } from './login';
import { provideRouter } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('Login', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage, ApolloTestingModule],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
