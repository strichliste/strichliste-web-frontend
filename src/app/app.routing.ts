import {Routes, RouterModule} from '@angular/router';
import {TallyListComponent} from './tally-list/tally-list.component';
import {UserDetailsComponent} from './user/user-details/user-details.component';
import {UserTransactionsComponent} from './user/user-transactions/user-transactions.component';
import {UserCreateComponent} from './user/user-create/user-create.component';

export const appRoutes: Routes = [
  {path: '', component: TallyListComponent},
  {path: 'user/create', component: UserCreateComponent},
  {path: 'user/:id', component: UserDetailsComponent},
  {path: 'user/:id/transactions', component: UserTransactionsComponent},
  {path: 'metrics', loadChildren: 'app/metrics/metrics.module#MetricsModule'}

];

export const Routing = RouterModule.forRoot(appRoutes);
