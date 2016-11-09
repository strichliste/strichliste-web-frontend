import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import {SettingsService} from '../../../shared/settings.service';
import {SettingsInterface} from '../../../shared/settings.interface';
import {CustomTransactionValidator} from './customTransactionValidator';

@Component({
  selector: 'tally-user-transaction-modal',
  templateUrl: './user-transaction-modal.component.html',
  styleUrls: ['./user-transaction-modal.component.less']
})
export class UserTransactionModalComponent implements OnInit {
  @Input() positive:boolean;
  settings:SettingsInterface;
  @Output() onAddTransaction = new EventEmitter();

  addTransactionForm:FormGroup;

  constructor(fb:FormBuilder) {
      this.settings  = {};
      const customTransactionValidator = new CustomTransactionValidator(this.settings, this.positive);
      this.addTransactionForm = fb.group({
        value: ['', Validators.compose([
          Validators.required, customTransactionValidator.transactionValidator])]
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
