import { TestBed } from '@angular/core/testing';

import { ShareCustomerElementService } from './share-customer-element-service.service';

describe('ShareCustomerElementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareCustomerElementService = TestBed.get(ShareCustomerElementService);
    expect(service).toBeTruthy();
  });
});
