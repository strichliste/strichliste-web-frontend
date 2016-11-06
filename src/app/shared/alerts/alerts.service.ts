import { Injectable } from '@angular/core';
import { AlertModel } from './alert.model';

@Injectable()
export class AlertsService {

  alerts:AlertModel[];

  constructor() {
    this.reset();
  }

  reset() {
    this.alerts = [];
  }

  add(alert:AlertModel) {
    this.alerts.push(alert);
  }

}
