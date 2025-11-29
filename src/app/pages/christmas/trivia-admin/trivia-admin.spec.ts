import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriviaAdmin } from './trivia-admin';

describe('TriviaAdmin', () => {
  let component: TriviaAdmin;
  let fixture: ComponentFixture<TriviaAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriviaAdmin]
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
