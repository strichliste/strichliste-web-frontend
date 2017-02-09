import {Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy} from '@angular/core';
import {TransactionValidators} from '../../../transaction-validators';

@Component({
  selector: 'tally-user-transaction-button',
  templateUrl: './user-transaction-button.component.html',
  styleUrls: ['./user-transaction-button.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  isInvalid(value) {
    return TransactionValidators.isInvalid(value, this.balance, this.boundaries, this.positive);
  }

  addTransaction(value) {
    value = this.positive ? value : value * -1;
    this.onAddTransaction.emit(value);
  }
}
