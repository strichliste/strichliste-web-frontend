import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import {UserInterface} from '../../user.interface';
import {SettingsInterface} from '../../../shared/settings.interface';

@Component({
  selector: 'tally-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListItemComponent implements OnInit {
  @Input() user: UserInterface;
  @Input() settings: SettingsInterface;

  constructor() {
  }

  ngOnInit() {
  }

}
