import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {TallyConfig} from '../shared/tally.config';
import {UserInterface} from './user.interface';
import {AppSettings} from '../app.settings';
import * as moment from 'moment';

@Injectable()
export class UserService {

  constructor(private http: Http, private settings: AppSettings) {
  }

  getUsers() {
    return this.http.get(TallyConfig.URL + 'user')
      .map(res => res.json());
  }

  getUserDetails(id: number) {
    return this.http.get(TallyConfig.URL + `user/${id}`)
      .map(res => res.json());
  }

  createUser(name: string) {
    return this.http.post(TallyConfig.URL + '/user', {name})
      .map(res => res.json());
  }

  splitUsersToActiveAndInActive(users: UserInterface[]) {
    return users.reduce((splitUsers, user) => {
      if (user.lastTransaction && moment().diff(moment(user.lastTransaction)) < this.settings.inactiveUserPeriod) {
        splitUsers.active.push(user);
      } else {
        splitUsers.inactive.push(user);
      }

      return splitUsers;
    }, {active: [], inactive: []});
  }

}
