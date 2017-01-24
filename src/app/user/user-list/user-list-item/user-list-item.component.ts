import {Component, OnInit, Input} from '@angular/core';
import {UserInterface} from '../../user.interface';
import {SettingsInterface} from '../../../shared/settings.interface';

@Component({
  selector: 'tally-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.less']
})
export class UserListItemComponent implements OnInit {
  @Input() user: UserInterface;
  @Input() settings: SettingsInterface;

  constructor() {
  }

  ngOnInit() {
  }

}
