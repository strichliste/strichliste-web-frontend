import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {TallyConfig} from './tally.config';
import {SettingsInterface} from './settings.interface';
import {BehaviorSubject} from 'rxjs';
import {AlertsService} from './alerts/alerts.service';
import {AlertModel} from './alerts/alert.model';

@Injectable()
export class SettingsService {

  private settingsSource = new BehaviorSubject<SettingsInterface>(null);
  settings$ = this.settingsSource.asObservable();

  constructor(private http: Http,
    private alertsService:AlertsService
  ) {
    this.initSettings();
  }

  initSettings() {
    this.http.get(`${TallyConfig.URL}settings`)
      .subscribe(res => {
        this.settingsSource.next(res.json())
      }, err => {
        this.alertsService.add(new AlertModel('danger', err));
      });
  }
}
