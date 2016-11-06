import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tally-metrics-overview',
  templateUrl: './metrics-overview.component.html',
  styleUrls: ['./metrics-overview.component.less']
})
export class MetricsOverviewComponent implements OnInit {
  @Input() users:number;
  @Input() transactions:number;
  @Input() balance:number;
  @Input() avgBalance:number;
  constructor() { }

  ngOnInit() {
  }

}
