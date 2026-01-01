import { TestBed } from '@angular/core/testing';
import { UsersService } from './usersService';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule
      ]
    });
    service = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
