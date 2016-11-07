import {Component, OnInit} from '@angular/core';
import {TallyListInterface} from './tally-list.interface';
import {UserService} from '../user/user.service';
import {AlertsService} from '../shared/alerts/alerts.service';
import {AlertModel} from '../shared/alerts/alert.model';
import {SettingsService} from '../shared/settings.service';
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

  constructor(
    private settingsService: SettingsService,
    private userService: UserService,
    private alertsService: AlertsService) {
  }

  ngOnInit() {
    this.getUsers();
    this.getSettings();
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

  getSettings() {
    this.settingsService.settings$.subscribe(res => {
      console.log(res);
    })
  }
}
