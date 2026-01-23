import { TestBed } from '@angular/core/testing';

import { PermissionDataSource } from './permission';

describe('Permission', () => {
  let service: PermissionDataSource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionDataSource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
