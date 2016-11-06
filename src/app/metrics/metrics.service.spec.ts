/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MetricsService } from './metrics.service';

describe('Service: Metrics', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetricsService]
    });
  });

  it('should ...', inject([MetricsService], (service: MetricsService) => {
    expect(service).toBeTruthy();
  }));
});
