import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {TransactionService} from '../transaction.service';
import {AlertsService} from '../../shared/alerts/alerts.service';
import {SettingsService} from '../../shared/settings.service';
import {SettingsInterface} from '../../shared/settings.interface';

@Component({
  selector: 'tally-user-transaction-button-set',
  templateUrl: './user-transaction-button-set.component.html',
  styleUrls: ['./user-transaction-button-set.component.less']
})
export class UserTransactionButtonSetComponent implements OnInit {
  @Input() userId:number;
  @Input() positive:boolean;

  @Output() onAddTransaction = new EventEmitter();

  settings: SettingsInterface;
  values: number[];

  constructor(private transactionService:TransactionService,
              private settingsService:SettingsService,
              private alertsService:AlertsService) {

    this.values = [
      0.5,
      1,
      2,
      5
    ];
  }

  ngOnInit() {
    if (!this.positive) {
      this.values = this.values.map(value => value * -1);
    }

    this.settingsService.settings$.subscribe(res => {
      this.settings = res;
    });
  }

  addTransaction(value:string) {
    this.onAddTransaction.emit();

    // this.transactionService.addTransaction(this.userId, value).toPromise().then(res => {
    //   this.onAddTransaction.emit();
    //
    // }, err => {
    //
    // });

    console.log('kuchen');
  }
}
