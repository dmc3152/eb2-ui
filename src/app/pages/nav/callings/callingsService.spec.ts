import { TestBed } from '@angular/core/testing';
import { CallingsService } from './callingsService';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('Users', () => {
  let service: CallingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule
      ]
    });
    service = TestBed.inject(CallingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
