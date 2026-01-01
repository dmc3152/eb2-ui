import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPage } from './users';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('Users', () => {
  let component: UsersPage;
  let fixture: ComponentFixture<UsersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UsersPage,
        ApolloTestingModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
