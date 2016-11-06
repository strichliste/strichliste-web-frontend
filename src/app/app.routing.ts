import {Routes, RouterModule} from '@angular/router';
import {TallyListComponent} from './tally-list/tally-list.component';

export const appRoutes: Routes = [
  {path: '', component: TallyListComponent},
  {path: 'metrics', loadChildren: 'app/metrics/metrics.module#MetricsModule'}

];

export const Routing = RouterModule.forRoot(appRoutes);
