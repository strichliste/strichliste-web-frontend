import { Component, OnInit, Input } from '@angular/core';
import {UserInterface} from './user.interface';
import {SettingsInterface} from '../shared/settings.interface';
import {UserService} from './user.service';
import {AlertsService} from '../shared/alerts/alerts.service';
import {AlertModel} from '../shared/alerts/alert.model';
import {UserStore} from './user.store';

@Component({
  selector: 'tally-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {

  users$;

  constructor(public userService: UserService,
              public userStore:UserStore,
              public alertsService: AlertsService) {

    this.users$ = this.userStore.store$;
  }

  ngOnInit() {}
}
