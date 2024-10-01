import { TestBed } from '@angular/core/testing';

import { PersonalCenterService } from './personal-center.service';

describe('PersonalCenterService', () => {
  let service: PersonalCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
