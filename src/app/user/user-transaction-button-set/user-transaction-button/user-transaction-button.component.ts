import {Component, OnInit, Input} from '@angular/core';
import {TransactionService} from '../../transaction.service';
import {AlertsService} from '../../../shared/alerts/alerts.service';

@Component({
  selector: 'tally-user-transaction-button',
  templateUrl: './user-transaction-button.component.html',
  styleUrls: ['./user-transaction-button.component.less']
})
export class UserTransactionButtonComponent implements OnInit {

  @Input() userId: number;
  @Input() positive: boolean;
  @Input() value: number;

  constructor(private transactionService: TransactionService, private alertsService:AlertsService) {
  }

  ngOnInit() {
  }

  addTransaction() {
    this.transactionService.addTransaction(this.userId, this.value).toPromise().then(res => {

    }, err => {

    });

    console.log('kuchen');
  }
}
