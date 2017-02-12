import {Component, OnInit, ElementRef} from '@angular/core';
import {MetricsService} from './metrics.service';
import {MetricsInterface} from './metrics.interface';
import {AlertsService} from '../shared/alerts/alerts.service';

declare var Chart: any;

@Component({
  selector: 'tally-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.less']
})
export class MetricsComponent implements OnInit {

  protected metrics: MetricsInterface;
  protected charts;
  chartOptions;
  payment;
  activeUser;
  transaction;
  constructor(private api: MetricsService, private alerts: AlertsService, el: ElementRef) {
    this.metrics = {
      countUsers: 0,
      countTransactions: 0,
      overallBalance: 0,
      avgBalance: 0,
      days: []
    };
    this.payment = {};
    this.activeUser = {};
    this.transaction = {};
    this.charts = [];
    // Chart.js Options
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
    }
  }

  ngOnInit() {
    this.getMetrics();
  }

  getMetrics() {
    this.api.getMetrics().toPromise().then(res => {
      this.metrics = res;
      this.initChartData(this.metrics)
      console.log(this.metrics, this.payment );
    }, err => {
      this.alerts.add(err);
    });
  }

  initChartData(metrics) {

    const spent = [], income = [], labels = [], users = [], transactions = [];

    function formatNumber(num) {
      return Math.round(num * 100) / 100;
    }

    metrics.days.forEach(function (day, index) {
      spent.push(formatNumber(day.dayBalanceNegative * -1));
      income.push(formatNumber(day.dayBalancePositive));

      users.push(day.distinctUsers);
      transactions.push(day.overallNumber);

      labels.push(day.date);
    });

    this.payment = {
      labels: labels,
      series: ['Spent', 'Income'],
      colors: ['#d9230f', '#0fd948'],
      data: [
        {data: spent, label:'Spent'},
        {data: income, label:'Income'}
      ]
    };

    this.activeUser = {
      labels: labels,
      series: ['Users'],
      colors: ['#ffa200'],
      data: [
        {data: users, label:'Users'}
      ]
    };

    this.transaction = {
      labels: labels,
      series: ['Transactions'],
      colors: ['#00a5ff'],
      data: [
        {data: transactions, label:'Transactions'}
      ]
    };
  }
}
