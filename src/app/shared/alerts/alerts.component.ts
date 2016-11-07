import {Component, OnInit} from '@angular/core';
import {AlertsService} from './alerts.service';
import {ActivatedRoute, Router, NavigationStart} from '@angular/router';

@Component({
  selector: 'tally-alerts',
  templateUrl: './alerts.component.html',
})
export class AlertsComponent implements OnInit {
  routeSubscription:any;
  constructor(private router: Router, public alertsService: AlertsService) {

    // reset alerts on routeChange
    this.routeSubscription = router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.alertsService.reset();
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

}
