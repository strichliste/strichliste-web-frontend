import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import {AlertsService} from '../../shared/alerts/alerts.service';
import {ActivatedRoute} from '@angular/router';
import {UserStore} from '../user.store';
import {AlertModel} from '../../shared/alerts/alert.model';

@Component({
  selector: 'tally-user-transactions',
  templateUrl: './user-transactions.component.html',
  styleUrls: ['./user-transactions.component.less']
})
export class UserTransactionsComponent {
  userId: number;
  queryParamsSubscribtion: any;
  limit;
  transactionState: any;
  transactionSubscribtion: any;

  constructor(private store: UserStore,
              private route: ActivatedRoute,
              cd: ChangeDetectorRef,
              private alertsService: AlertsService) {
    this.limit = 10;
    this.queryParamsSubscribtion = this.route.params.subscribe((param) => {
      this.userId = param['id'];
      this.store.getUserTransactions(this.userId, this.limit, 0)
        .then(null, err => this.alertsService.add(new AlertModel('dange', err)));
    });

    this.transactionSubscribtion = this.store.store$.map((state) => state.userTransactions)
      .subscribe((transactionState) => {
        this.transactionState = transactionState;
        cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this.queryParamsSubscribtion.unsubscribe();
    this.transactionSubscribtion.unsubscribe();
  }
}
