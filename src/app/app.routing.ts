import {Routes, RouterModule} from '@angular/router';
import {TallyListComponent} from './tally-list/tally-list.component';

export const appRoutes: Routes = [
  {path: '', component: TallyListComponent},
];

export const Routing = RouterModule.forRoot(appRoutes);
