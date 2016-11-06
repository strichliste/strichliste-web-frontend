/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AlertsService } from './alerts.service';

describe('Service: Alerts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertsService]
    });
  });

  it('should ...', inject([AlertsService], (service: AlertsService) => {
    expect(service).toBeTruthy();
  }));
});
