import {Component, OnInit, Input} from '@angular/core';
import {UserService} from '../user.service';
import {UserInterface} from '../user.interface';
import {AlertModel} from '../../shared/alerts/alert.model';
import {AlertsService} from '../../shared/alerts/alerts.service';

@Component({
  selector: 'tally-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less']
})
export class UserListComponent implements OnInit {
  @Input() users: UserInterface[];
  filteredUsers: UserInterface[];

  constructor(public userService: UserService,
              public alertsService: AlertsService) {
  }


  ngOnInit() {
  }

  ngOnChanges(changes){
    if (changes.users) {
      this.updateList(this.users);
    }
  }

  updateList(filteredList: UserInterface[]) {
    this.filteredUsers = filteredList;
  }

}
