import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsComponent } from './metrics.component';
import {RouterModule} from '@angular/router';
import {MetricsService} from './metrics.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: MetricsComponent }
    ])
  ],
  declarations: [MetricsComponent],
  providers: [MetricsService]
})
export class MetricsModule { }
