import { TestBed } from '@angular/core/testing';

import { ClientSelectedService } from './client-selected.service';

describe('ClientSelectedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientSelectedService = TestBed.get(ClientSelectedService);
    expect(service).toBeTruthy();
  });
});
