/**
 * Created by Tobias on 07.02.2017.
 */
import {Injectable} from '@angular/core';
@Injectable()
export class AppSettings {
  inactiveUserPeriod: number;

  constructor(){
    this.inactiveUserPeriod = 1000000000;
  }
}
