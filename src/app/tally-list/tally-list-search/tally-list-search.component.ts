import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'tally-tally-list-search',
  templateUrl: './tally-list-search.component.html',
  styleUrls: ['./tally-list-search.component.less']
})
export class TallyListSearchComponent implements OnInit {
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

  ngOnInit() {
  }

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
