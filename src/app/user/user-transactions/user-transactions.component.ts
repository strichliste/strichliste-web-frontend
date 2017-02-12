import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import {AlertsService} from '../../shared/alerts/alerts.service';
import {ActivatedRoute} from '@angular/router';
import {UserStore} from '../user.store';
import {AlertModel} from '../../shared/alerts/alert.model';
import {UserTransactionStore} from './user-transaction.store';

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

  constructor(private store: UserTransactionStore,
              private route: ActivatedRoute,
              public userStore: UserStore,
              cd: ChangeDetectorRef,
              private alertsService: AlertsService) {
    this.limit = 10;
    this.queryParamsSubscribtion = this.route.params.subscribe((param) => {
      this.userId = param['id'];
      this.store.getUserTransactions(this.userId, this.limit, 0)
        .then(null, err => this.alertsService.add(new AlertModel('danger', err)));
    });

    this.transactionSubscribtion = this.store.state$
      .subscribe((transactionState) => {
        this.transactionState = transactionState;
        console.log(transactionState);
        cd.markForCheck();
      });
  }

  pageNext() {
    if (this.transactionState.page < this.transactionState.maxPage) {
      const newOffset = this.transactionState.offset + this.limit;
      this.page(newOffset);
    }
  }

  pagePrev() {
    if (this.transactionState.page > 1) {
      const newOffset = this.transactionState.offset - this.limit;
      this.page(newOffset);
    }
  }

  page(offset) {
    this.store.getUserTransactions(this.userId, this.limit, offset);
  }

  ngOnDestroy() {
    this.queryParamsSubscribtion.unsubscribe();
    this.transactionSubscribtion.unsubscribe();
  }
}
