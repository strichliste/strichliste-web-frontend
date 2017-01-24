import {Component, OnInit} from '@angular/core';
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
  users: UserInterface[];
  filteredUsers: UserInterface[];

  constructor(public userService: UserService,
              public alertsService: AlertsService) {
  }


  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().toPromise().then((res) => {

      if (res && res.entries) {
        this.users = res.entries;
        this.updateList(this.users);
      } else {
        this.alertsService.add(new AlertModel('info', 'no users found!'));
      }
    }, (err) => {
      this.alertsService.add(new AlertModel('danger', err));
    });
  }

  updateList(filteredList: UserInterface[]) {
    this.filteredUsers = filteredList;
  }

}
