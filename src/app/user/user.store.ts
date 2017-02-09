import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserInterface} from './user.interface';
import {UserService} from './user.service';
import * as moment from 'moment';
import {AppSettings} from '../app.settings';
import {UserModel} from './shared/user.model';
import {toPromise} from 'rxjs/operator/toPromise';
import {TransactionInterface} from './user-transactions/transaction.interface';
import {SettingsInterface} from '../shared/settings.interface';
import {TransactionService} from './transaction.service';
import {SettingsService} from '../shared/settings.service';

/**
 * Created by Tobias on 23.01.2017.
 */
@Injectable()
export class UserStore {
  state:UserStateInterface;

  store$: BehaviorSubject<UserStateInterface>;
  state$;

  constructor(private userService: UserService, private transactionService:TransactionService,
              private settingsService:SettingsService,
              private settings: AppSettings) {

    this.state = {
      query: '',
      users: [],
      activeUsers: [],
      inactiveUsers: [],
      userTransactions: [],
      selectedUser: null,
      settings: {
        boundaries: {
          lower: 0,
          upper: 0
        }
      }
    };

    this.store$ = new BehaviorSubject(this.state);
    this.state$ = this.store$.asObservable().share();
  }

  getSettings():Promise<any> {
    return this.settingsService.getSettings().toPromise().then(res => {
      const newState = Object.assign(this.state, {settings:res});
      this.store$.next(newState);
    });
  }

  getInitialUsers(): Promise<any> {
    return this.userService.getUsers().toPromise().then((res) => {
      if (res && res.entries) {
        const splitUsers: any = this.getSplitUsers(res.entries);

        this.sortUsers(splitUsers.active);
        this.sortUsers(splitUsers.inactive);

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
      }) : this.state.users;

    const splitUsers = this.getSplitUsers(filteredUsers);

    const newState = Object.assign(this.state, {
      query: query,
      inactiveUsers: splitUsers.inactive,
      activeUsers: splitUsers.active,
    });

    this.store$.next(newState);
  }

  sortUsers(users:UserInterface[]) {
    users.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }

  getSplitUsers(users) {
    return users.reduce((splitUsers, user) => {
      if (user.lastTransaction && moment().diff(moment(user.lastTransaction)) < this.settings.inactiveUserPeriod) {
        splitUsers.active.push(user);
      } else {
        splitUsers.inactive.push(user);
      }

      return splitUsers;
    }, {active: [], inactive: []});
  }

  selectUser(user) {
    const newState = Object.assign(this.state, {
      selectedUser: user
    });

    this.store$.next(newState);
  }

  getUserDetails(userId) {
    return this.userService.getUserDetails(userId).toPromise()
      .then((details) => {
        const newState = Object.assign(this.state, {
          selectedUser: details
        });

        console.log(this.state,newState );

        this.store$.next(newState);
      });
  }

  addUser(name: string): Promise<number> {
    return this.userService.createUser(name).toPromise().then(res => {
      if (res && res.id) {
        const newUser = new UserModel({id: res.id, name});
        const newUsers = [...this.state.users, newUser];
        const splitUsers = this.getSplitUsers(newUsers);
        const newState = Object.assign(this.state, {
          query: '',
          users: newUsers,
          activeUsers: splitUsers.active,
          inactiveUsers: splitUsers.inactive,
          selectedUser: newUser
        });

        this.store$.next(newState);
        return res.id;
      }
    });
  }

  addUserTransaction(value) {
    return this.transactionService.addTransaction(this.state.selectedUser.id, value).toPromise().then(
      res => {
      this.getUserDetails(this.state.selectedUser.id);
      return this.getInitialUsers();
    });
  }
}

interface UserStateInterface {
  query: string,
  users: UserInterface[],
  activeUsers: UserInterface[],
  inactiveUsers: UserInterface[],
  userTransactions: TransactionInterface[],
  selectedUser: UserInterface,
  settings: SettingsInterface
}
