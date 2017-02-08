import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import {UserService} from '../user.service';
import {UserInterface} from '../user.interface';
import {AlertModel} from '../../shared/alerts/alert.model';
import {AlertsService} from '../../shared/alerts/alerts.service';

@Component({
  selector: 'tally-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  @Input() users: UserInterface[];

  constructor(public userService: UserService,
              public alertsService: AlertsService) {
  }
}
