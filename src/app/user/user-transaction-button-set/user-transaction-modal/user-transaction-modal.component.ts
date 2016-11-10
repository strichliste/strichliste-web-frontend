import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {TransactionValidators} from '../../transaction-validators';

@Component({
  selector: 'tally-user-transaction-modal',
  templateUrl: './user-transaction-modal.component.html',
  styleUrls: ['./user-transaction-modal.component.less']
})
export class UserTransactionModalComponent implements OnInit {
  @Input() positive: boolean;
  @Input() balance: number;
  @Input() boundaries: {lower: number, upper: number};

  @Output() onAddTransaction = new EventEmitter();
  addTransactionForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.addTransactionForm = this.fb.group({
      value: ['', Validators.compose([
        Validators.required])]
    });
  }

  addTransaction(value: number) {
    if (!this.positive) {
      value *= -1;
    }
    this.onAddTransaction.emit(value);
  }

  isInvalid(formValue) {
    return TransactionValidators.isInvalid(formValue,this.balance,this.boundaries, this.positive);
  }
}
