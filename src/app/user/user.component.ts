import { Component, OnInit, Input } from '@angular/core';
import {UserInterface} from './user.interface';
import {SettingsInterface} from '../shared/settings.interface';
import {UserService} from './user.service';
import {AlertsService} from '../shared/alerts/alerts.service';
import {AlertModel} from '../shared/alerts/alert.model';

@Component({
  selector: 'tally-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {

  activeUsers:UserInterface[];
  inactiveUsers:UserInterface[];

  constructor(public userService: UserService,
              public alertsService: AlertsService) {
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().toPromise().then((res) => {

      if (res && res.entries) {
        this.updateList(res.entries);
      } else {
        this.alertsService.add(new AlertModel('info', 'no users found!'));
      }
    }, (err) => {
      this.alertsService.add(new AlertModel('danger', err));
    });
  }

  updateList(users: UserInterface[]) {
    const splitUsers = this.userService.splitUsersToActiveAndInActive(users);

    this.activeUsers = splitUsers.active;
    this.inactiveUsers = splitUsers.inactive;

    console.log(splitUsers);
  }

}
