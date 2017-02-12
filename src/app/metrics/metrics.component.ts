import {Component, OnInit, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {MetricsInterface} from './metrics.interface';
import {MetricsStore} from './metrics.store';

declare var Chart: any;

@Component({
  selector: 'tally-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class MetricsComponent implements OnInit {

  protected metrics: MetricsInterface;
  protected  metricsSubscription;
  chartOptions;
  constructor(private store:MetricsStore, cd:ChangeDetectorRef) {

    this.chartOptions = {
      animation: false,
      maintainAspectRatio: false,
      responsive: true,

      scaleShowGridLines: true,
      scaleGridLineColor: "rgba(0,0,0,.05)",
      scaleGridLineWidth: 1,

      barValueSpacing: 3,
      barDatasetSpacing: 2,

      barShowStroke: true,
      barStrokeWidth: 1
    };

    this.store.getMetrics();
    this.metricsSubscription = this.store.state$.subscribe((metrics) => {
      this.metrics = metrics;
      cd.markForCheck();
    });
  }
  ngOnInit() {

  }

  ngOnDestroy(){
    this.metricsSubscription.unsubscribe();
  }
}
