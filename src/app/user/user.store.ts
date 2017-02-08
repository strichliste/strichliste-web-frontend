import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserInterface} from './user.interface';
import {UserService} from './user.service';
import * as moment from 'moment';
import {AppSettings} from '../app.settings';

/**
 * Created by Tobias on 23.01.2017.
 */
@Injectable()
export class UserStore {
  state;

  store$;
  state$;

  constructor(public userService:UserService, private settings: AppSettings){

    this.state = {
      query:'',
      users: [],
      activeUsers:[],
      inactiveUsers:[],
      selectedUser: null,
      settings: null
    };

    this.store$ = new BehaviorSubject(this.state);
    this.state$ = this.store$.asObservable().share();
  }

  getInitialUsers(): Promise<any> {
    return this.userService.getUsers().toPromise().then((res) => {
      if (res && res.entries) {
        const splitUsers:any = this.splitUsers(res.entries);
        const newState = Object.assign(this.state, {
          users: res.entries,
          inactiveUsers: splitUsers.inactive,
          activeUsers: splitUsers.active,
        });
        this.store$.next(newState);
      }
    });
  }

  filterUsers(query) {

    const filteredUsers = query ? this.state.users.filter((user) => {
      return user.name.indexOf(query) > -1;
    }): this.state.users;

    const splitUsers = this.splitUsers(filteredUsers);

    const newState = Object.assign(this.state, {
      query:query,
      inactiveUsers: splitUsers.inactive,
      activeUsers: splitUsers.active,
    });

    this.store$.next(newState);
  }

  splitUsers(users){
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

