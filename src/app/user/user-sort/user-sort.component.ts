import { Component, OnInit } from '@angular/core';
import {UserStore} from '../user.store';

@Component({
  selector: 'tally-user-sort',
  templateUrl: './user-sort.component.html',
  styleUrls: ['./user-sort.component.less']
})
export class UserSortComponent implements OnInit {
  storeSubscription;
  sortBy:string;

  constructor(private store:UserStore) {
  }

  ngOnInit() {
    this.storeSubscription = this.store.store$.map(userState => userState.sortBy)
      .subscribe(sortBy => this.sortBy = sortBy);
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
  }

  triggerSort(sortBy) {
    this.store.updateSortBy(sortBy);
  }
}
