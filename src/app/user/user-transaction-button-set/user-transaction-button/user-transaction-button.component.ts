import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'tally-user-transaction-button',
  templateUrl: './user-transaction-button.component.html',
  styleUrls: ['./user-transaction-button.component.less']
})
export class UserTransactionButtonComponent implements OnInit {

  @Input() positive: boolean;
  @Input() value: number;

  @Output() onAddTransaction = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  addTransaction() {
    this.onAddTransaction.emit(this.value);
  }
}
