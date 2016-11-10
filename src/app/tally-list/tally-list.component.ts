import {Component, OnInit} from '@angular/core';
import {TallyListInterface} from './tally-list.interface';
import {UserService} from '../user/user.service';
import {AlertsService} from '../shared/alerts/alerts.service';
import {AlertModel} from '../shared/alerts/alert.model';
import {SettingsInterface} from '../shared/settings.interface';
import {UserInterface} from '../user/user.interface';

@Component({
  selector: 'tally-tally-list',
  templateUrl: './tally-list.component.html',
  styleUrls: ['./tally-list.component.less']
})
export class TallyListComponent implements OnInit {
  protected userList:UserInterface[];
  protected settings:SettingsInterface;
  protected filteredList:UserInterface[];
  constructor(
    private userService: UserService,
    private alertsService: AlertsService) {
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().toPromise().then((res: TallyListInterface) => {

      if (res && res.entries) {
        this.userList = res.entries;
        this.updateList(this.userList);
      } else {
        this.alertsService.add(new AlertModel('info', 'no users found!'));
      }
    }, (err) => {
      this.alertsService.add(new AlertModel('danger', err));
    });
  }

  updateList(filteredList:UserInterface[]) {
    this.filteredList = filteredList;
  }
}
