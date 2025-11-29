import { TestBed } from '@angular/core/testing';

import { TriviaGameService } from './trivia-game';

describe('TriviaGame', () => {
  let service: TriviaGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TriviaGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
