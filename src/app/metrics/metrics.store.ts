import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MetricsService} from './metrics.service';
import {AlertsService} from '../shared/alerts/alerts.service';
/**
 * Created by Tobias on 23.01.2017.
 */
@Injectable()
export class MetricsStore {

  state;
  state$: BehaviorSubject<any>;

  constructor(private alerts: AlertsService,
              private transactionService:MetricsService) {
    this.state = {
      avgBalance: 0,
      countTransactions: 0,
      countUsers: 0,
      days: [],
      overallBalance: 0,
      payment: {},
      activeUser: {},
      transaction: {},
    };

    this.state$ = new BehaviorSubject(this.state);
  }


  getMetrics() {
    this.transactionService.getMetrics().toPromise().then(res => {
      const newState = Object.assign(res, this.initChartData(res));
      this.state$.next(newState);
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

    metrics.payment = {
      labels: labels,
      series: ['Spent', 'Income'],
      colors: ['#d9230f', '#0fd948'],
      data: [
        {data: spent, label:'Spent'},
        {data: income, label:'Income'}
      ]
    };

    metrics.activeUser = {
      labels: labels,
      series: ['Users'],
      colors: ['#ffa200'],
      data: [
        {data: users, label:'Users'}
      ]
    };

    metrics.transaction = {
      labels: labels,
      series: ['Transactions'],
      colors: ['#00a5ff'],
      data: [
        {data: transactions, label:'Transactions'}
      ]
    };

    return metrics;
  }
}
