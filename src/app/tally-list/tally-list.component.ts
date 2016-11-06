import { Component, OnInit } from '@angular/core';
import {TallyListInterface} from './tally-list.interface';
import {UserService} from '../user/user.service';
import {AlertsService} from '../shared/alerts/alerts.service';
import {AlertModel} from '../shared/alerts/alert.model';

@Component({
  selector: 'tally-tally-list',
  templateUrl: './tally-list.component.html',
  styleUrls: ['./tally-list.component.less']
})
export class TallyListComponent implements OnInit {
  protected userList;

  constructor(private userService: UserService, private alertsService:AlertsService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().toPromise().then((res: TallyListInterface) => {

      if (res && res.entries) {
        this.userList = res.entries;
      } else {
        this.alertsService.add(new AlertModel('info', 'no users found!'));
      }
    }, (err) => {
      this.alertsService.add(new AlertModel('danger', err));
    });
  }
}
