import {Routes, RouterModule} from '@angular/router';
import {UserDetailsComponent} from './user/user-details/user-details.component';
import {UserTransactionsComponent} from './user/user-transactions/user-transactions.component';
import {UserCreateComponent} from './user/user-create/user-create.component';
import {SettingsResolver} from './shared/settings.resolver';
import {UserComponent} from './user/user.component';

export const appRoutes: Routes = [
  {path: '', component: UserComponent},
  {path: 'user/create', component: UserCreateComponent},
  {
    path: 'user/:id',
    component: UserDetailsComponent,
    resolve: {
      settings: SettingsResolver
    }
  },
  {path: 'user/:id/transactions', component: UserTransactionsComponent},
  {path: 'metrics', loadChildren: 'app/metrics/metrics.module#MetricsModule'}

];

export const Routing = RouterModule.forRoot(appRoutes);
