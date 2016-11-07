import {Component, OnInit, Input} from '@angular/core';
import {TransactionService} from '../transaction.service';
import {AlertsService} from '../../shared/alerts/alerts.service';
import {AlertModel} from '../../shared/alerts/alert.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'tally-user-transactions',
  templateUrl: './user-transactions.component.html',
  styleUrls: ['./user-transactions.component.less']
})
export class UserTransactionsComponent implements OnInit {
  userId:number;
  transactions: any[];
  queryParamsSubscribtion:any;
  constructor(private transactionService: TransactionService,
              private route:ActivatedRoute,
              private alertsService: AlertsService) {
    this.queryParamsSubscribtion = this.route.params.subscribe((param) => {
      this.userId = param['id'];
    });
  }

  ngOnInit() {
    this.getUserTransactions(10, 0);
  }

  getUserTransactions(limit, offset) {
    this.transactionService.getTransactions(this.userId, limit, offset).toPromise().then((res: any) => {
      if (res && res.entries) {
        this.transactions = res.entries;
      }
    }, (err) => {
      this.alertsService.add(new AlertModel('danger', err));
    }) ;
  }

}
