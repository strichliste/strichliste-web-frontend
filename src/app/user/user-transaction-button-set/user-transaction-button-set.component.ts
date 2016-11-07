import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'tally-user-transaction-button-set',
  templateUrl: './user-transaction-button-set.component.html',
  styleUrls: ['./user-transaction-button-set.component.less']
})
export class UserTransactionButtonSetComponent implements OnInit {
  @Input() userId:number;
  @Input() positive:boolean;
  values: number[];
  constructor() {

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
  }

}
