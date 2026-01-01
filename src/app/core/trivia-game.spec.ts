import { TestBed } from '@angular/core/testing';

import { TriviaGameService } from './trivia-game';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('TriviaGame', () => {
  let service: TriviaGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule
      ]
    });
    service = TestBed.inject(TriviaGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
