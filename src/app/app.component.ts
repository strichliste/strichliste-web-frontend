import {Component} from '@angular/core';
import {AlertsService} from './shared/alerts/alerts.service';
import {AlertModel} from './shared/alerts/alert.model';

@Component({
  selector: 'tally-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  constructor(private alertsService: AlertsService) {
    alertsService.add(new AlertModel('success', 'das ist ein test'));
  }
}
