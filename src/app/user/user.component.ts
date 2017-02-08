import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {UserService} from './user.service';
import {AlertsService} from '../shared/alerts/alerts.service';
import {UserStore} from './user.store';

@Component({
  selector: 'tally-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush

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
