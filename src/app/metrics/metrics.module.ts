import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsComponent } from './metrics.component';
import {RouterModule} from '@angular/router';
import {MetricsService} from './metrics.service';
import { MetricsOverviewComponent } from './metrics-overview/metrics-overview.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: MetricsComponent }
    ])
  ],
  declarations: [MetricsComponent, MetricsOverviewComponent],
  providers: [MetricsService]
})
export class MetricsModule { }
