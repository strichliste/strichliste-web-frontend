import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {UserStore} from '../user.store';

@Component({
  selector: 'tally-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.less']
})
export class UserSearchComponent implements OnInit {
  searchForm:FormControl;
  querySubscription;

  constructor(public store:UserStore) {
    this.searchForm = new FormControl();
    this.searchForm.setValue(this.store.state.query);
  }

  ngOnInit() {
    this.querySubscription = this.searchForm.valueChanges.subscribe((query) => {
      this.store.filterUsers(query);
    });
  }

  ngOnDestroy(){

  }

}
