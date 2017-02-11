import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserInterface} from './user.interface';
import {UserService} from './user.service';
import * as moment from 'moment';
import {AppSettings} from '../app.settings';
import {UserModel} from './shared/user.model';
import {SettingsInterface} from '../shared/settings.interface';
import {TransactionService} from './transaction.service';
import {SettingsService} from '../shared/settings.service';

/**
 * Created by Tobias on 23.01.2017.
 */
@Injectable()
export class UserStore {
  state: UserStateInterface;

  store$: BehaviorSubject<UserStateInterface>;
  state$;

  constructor(private userService: UserService, private transactionService: TransactionService,
              private settingsService: SettingsService,
              private settings: AppSettings) {

    this.state = {
      query: '',
      users: [],
      activeUsers: [],
      inactiveUsers: [],
      userTransactions: {
        offset: 0,
        overallCount: 0,
        limit: 10,
        entries: []
      },
      userTransactionModal: {
        show: false,
      },
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

  getSettings(): Promise<any> {
    return this.settingsService.getSettings().toPromise().then(res => {
      const newState = Object.assign(this.state, {settings: res});
      this.store$.next(newState);
    });
  }

  getInitialUsers(): Promise<any> {
    return this.userService.getUsers().toPromise().then((res) => {
      if (res && res.entries) {
        const splitUsers: any = this.getSplitUsers(res.entries);

        UserStore.sortUsers(splitUsers.active);
        UserStore.sortUsers(splitUsers.inactive);

        const newState = Object.assign(this.state, {
          query: '',
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
        return user.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
      }) : this.state.users;

    const splitUsers = this.getSplitUsers(filteredUsers);

    const newState = Object.assign(this.state, {
      query: query,
      inactiveUsers: splitUsers.inactive,
      activeUsers: splitUsers.active,
    });

    this.store$.next(newState);
  }

  static sortUsers(users: UserInterface[]) {
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

        console.log(this.state, newState);

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
      () => {
        this.getUserDetails(this.state.selectedUser.id);
        return this.getInitialUsers();
      });
  }

  getUserTransactions(userId, limit, offset) {
    return this.transactionService.getTransactions(userId, limit, offset).toPromise().then( res => {
      console.log(res);
      const newState = Object.assign(this.state, {userTransactions: res});
      this.store$.next(newState);
    });
  }

  showUserTransactionModal(show) {
    const newuserTransactionModal = Object.assign(this.state.userTransactionModal, {show});
    this.store$.next(Object.assign(this.state, newuserTransactionModal ));
  }
}

interface UserStateInterface {
  query: string,
  users: UserInterface[],
  activeUsers: UserInterface[],
  inactiveUsers: UserInterface[],
  userTransactions: any,
  userTransactionModal: any,
  selectedUser: UserInterface,
  settings: SettingsInterface
}
