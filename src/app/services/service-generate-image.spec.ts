import { TestBed } from '@angular/core/testing';

import { ServiceGenerateImage } from './service-generate-image';

describe('ServiceGenerateImage', () => {
  let service: ServiceGenerateImage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceGenerateImage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
