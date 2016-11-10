import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {TransactionService} from '../transaction.service';
import {AlertsService} from '../../shared/alerts/alerts.service';
import {ActivatedRoute} from '@angular/router';
import {UserInterface} from '../user.interface';

@Component({
  selector: 'tally-user-transaction-button-set',
  templateUrl: './user-transaction-button-set.component.html',
  styleUrls: ['./user-transaction-button-set.component.less']
})
export class UserTransactionButtonSetComponent implements OnInit {
  @Input() user:UserInterface;
  @Input() positive:boolean;

  @Output() onAddTransaction = new EventEmitter();

  values: number[];
  boundaries: {upper:number, lower:number};

  constructor(private transactionService:TransactionService,
              route: ActivatedRoute,
              private alertsService:AlertsService) {

    const settings = route.snapshot.data['settings'];

    this.boundaries = settings.boundaries;

    this.values = [
      0.5,
      1,
      2,
      5
    ];
  }

  ngOnInit() {
    // if (!this.positive) {
    //   this.values = this.values.map(value => value * -1);
    // }
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
