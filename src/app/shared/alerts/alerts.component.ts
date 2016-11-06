import {Component, OnInit} from '@angular/core';
import {AlertsService} from './alerts.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'tally-alerts',
  templateUrl: './alerts.component.html',
})
export class AlertsComponent implements OnInit {
  routsubscription:any;
  constructor(private route: ActivatedRoute, public alertsService: AlertsService) {

    // reset alerts on routeChange
    this.routsubscription = this.route.url.subscribe(() => {
      console.log(this.alertsService.alerts, 'test' );
      this.alertsService.reset();
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.routsubscription.unsubscribe();
  }

}
