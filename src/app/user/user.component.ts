import { Component, OnInit, Input } from '@angular/core';
import {UserInterface} from './user.interface';
import {SettingsInterface} from '../shared/settings.interface';

@Component({
  selector: 'tally-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {
  @Input() user:UserInterface;
  @Input() settings:SettingsInterface;
  constructor() { }

  ngOnInit() {
  }

}
