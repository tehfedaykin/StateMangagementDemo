import { TestBed } from '@angular/core/testing';

import { VillagerStateService } from './villager-state.service';

describe('VillagerStateService', () => {
  let service: VillagerStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VillagerStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
