import {Component, ChangeDetectionStrategy} from '@angular/core';
import {AlertsService} from './shared/alerts/alerts.service';
import {AlertModel} from './shared/alerts/alert.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/share';
import {UserStore} from './user/user.store';

@Component({
  selector: 'tally-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  constructor(private alertsService: AlertsService, userStore:UserStore) {
    userStore.getSettings().then(null,err => this.showError(err));
    userStore.getInitialUsers().then(null, err => this.showError(err));
  }

  showError(err) {
    this.alertsService.add(new AlertModel('danger', err));
  }
}
