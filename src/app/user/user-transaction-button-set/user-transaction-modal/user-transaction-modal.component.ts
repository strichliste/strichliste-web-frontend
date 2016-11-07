import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'tally-user-transaction-modal',
  templateUrl: './user-transaction-modal.component.html',
  styleUrls: ['./user-transaction-modal.component.less']
})
export class UserTransactionModalComponent implements OnInit {
  @Input() positive:boolean;
  @Output() onAddTransaction = new EventEmitter();

  addTransactionForm:FormGroup;

  constructor(fb:FormBuilder) {
    this.addTransactionForm = fb.group({
      value: ['']
    });
  }

  ngOnInit() {}

  addTransaction(value:number) {
    if (!this.positive) {
      value *= -1;
    }
    this.onAddTransaction.emit(value);
  }
}
