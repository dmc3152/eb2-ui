import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriviaAdmin } from './trivia-admin';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('TriviaAdmin', () => {
  let component: TriviaAdmin;
  let fixture: ComponentFixture<TriviaAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriviaAdmin, ApolloTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TriviaAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
