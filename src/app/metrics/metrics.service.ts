import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {TallyConfig} from '../shared/tally.config';

@Injectable()
export class MetricsService {

  constructor(private http:Http) { }

  getMetrics() {
    return this.http.get(`${TallyConfig.URL}metrics`).map(res => res.json());
  }
}
