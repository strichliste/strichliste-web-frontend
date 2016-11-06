import { Component, OnInit } from '@angular/core';
import {MetricsService} from './metrics.service';
import {MetricsInterface} from './metrics.interface';
import {AlertsService} from '../shared/alerts/alerts.service';

@Component({
  selector: 'tally-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.less']
})
export class MetricsComponent implements OnInit {

  protected metrics:MetricsInterface;
  protected charts;
  constructor(private api:MetricsService, private alerts:AlertsService) {
    this.metrics = {
      countUsers: 0,
      countTransactions: 0,
      overallBalance: 0,
      avgBalance: 0,
      days: []
    };
    this.charts = [];
  }

  ngOnInit() {
    this.getMetrics();
  }

  getMetrics() {
    this.api.getMetrics().toPromise().then(res => {
      this.metrics = res;
    }, err => {
      this.alerts.add(err);
    });
  }
}
