import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {UserInterface} from '../user.interface';

@Component({
  selector: 'tally-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  @Input() users: UserInterface[];
  @Input() showCreateUser:boolean;
}
