import { TestBed } from '@angular/core/testing';
import { CallingsService } from './callingsService';

describe('Users', () => {
  let service: CallingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
