import { TestBed } from '@angular/core/testing';

import { AcnhApiService } from './acnh-api.service';

describe('AcnhApiService', () => {
  let service: AcnhApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcnhApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
