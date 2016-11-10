import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {TallyConfig} from './tally.config';

@Injectable()
export class SettingsService {

  constructor(private http: Http) {}

  getSettings() {
      return this.http.get(`${TallyConfig.URL}settings`).map(res => res.json());
  }
}
