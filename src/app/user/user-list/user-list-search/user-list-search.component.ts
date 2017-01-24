import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'tally-user-list-search',
  templateUrl: './user-list-search.component.html',
  styleUrls: ['./user-list-search.component.less']
})
export class UserListSearchComponent implements OnInit {
  @Input() list;
  @Output() onFilterList = new EventEmitter();

  filterForm:FormGroup;
  showSearch:boolean;

  constructor(fb:FormBuilder) {


    this.showSearch = false;
    this.filterForm = fb.group({
      query:['']
    });

    this.filterForm.controls['query'].valueChanges.subscribe((query:string) => {
      this.filterList(query);
    });
  }

  ngOnInit() {}

  filterList(query:string) {
    var filteredList;

    if (query) {
      filteredList = this.list.filter((user) => {
        return user.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
      });
    } else {
      filteredList = this.list;
    }
    this.onFilterList.emit(filteredList);
  }

  toggleShowSearch() {
    this.showSearch = !this.showSearch;

    if (!this.showSearch) {
      this.onFilterList.emit(this.list);
    }
  }
}
