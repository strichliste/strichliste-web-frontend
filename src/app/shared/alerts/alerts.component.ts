import { Component, OnInit } from '@angular/core';
import { AlertsService } from './alerts.service';

@Component({
  selector: 'tally-alerts',
  templateUrl: './alerts.component.html',
})
export class AlertsComponent implements OnInit {

  constructor(public alertsService:AlertsService) { }

  ngOnInit() {}

}
