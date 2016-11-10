import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {TransactionValidators} from '../../transaction-validators';

@Component({
  selector: 'tally-user-transaction-button',
  templateUrl: './user-transaction-button.component.html',
  styleUrls: ['./user-transaction-button.component.less']
})
export class UserTransactionButtonComponent implements OnInit {

  @Input() positive: boolean;
  @Input() value: number;
  @Input() balance: number;
  @Input() boundaries: {lower: number, upper: number};

  @Output() onAddTransaction = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  isInvalid() {
    return TransactionValidators.isInvalid(this.value, this.balance, this.boundaries, this.positive);
  }

  addTransaction() {
    this.onAddTransaction.emit(this.value);
  }
}
