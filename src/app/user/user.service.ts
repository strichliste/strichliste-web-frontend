import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {TallyConfig} from '../shared/tally.config';
import {UserInterface} from './user.interface';
import {AppSettings} from '../app.settings';

@Injectable()
export class UserService {

  constructor(private http: Http) {
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
}
