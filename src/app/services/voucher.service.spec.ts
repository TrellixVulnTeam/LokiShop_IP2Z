import { TestBed, inject } from '@angular/core/testing';

import { VoucherService} from './voucher.service';

describe('Voucher.ServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VoucherService]
    });
  });

  it('should be created', inject([VoucherService], (service: VoucherService) => {
    expect(service).toBeTruthy();
  }));
});
