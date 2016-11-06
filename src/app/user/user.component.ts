import { Component, OnInit, Input } from '@angular/core';
import {UserInterface} from './user.interface';

@Component({
  selector: 'tally-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {
  @Input() user:UserInterface;
  constructor() { }

  ngOnInit() {
  }

}
