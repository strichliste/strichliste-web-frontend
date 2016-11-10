import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AlertsComponent} from './shared/alerts/alerts.component';
import {AlertsService} from './shared/alerts/alerts.service';
import {Routing} from './app.routing';
import {TallyListComponent} from './tally-list/tally-list.component';
import {UserComponent} from './user/user.component';
import {UserDetailsComponent} from './user/user-details/user-details.component';
import {UserTransactionsComponent} from './user/user-transactions/user-transactions.component';
import {UserService} from './user/user.service';
import {ModalModule} from 'ng2-bootstrap';
import {UserCreateComponent} from './user/user-create/user-create.component';
import {TransactionService} from './user/transaction.service';
import {UserTransactionButtonSetComponent} from './user/user-transaction-button-set/user-transaction-button-set.component';
import {UserTransactionButtonComponent} from './user/user-transaction-button-set/user-transaction-button/user-transaction-button.component';
import {UserTransactionModalComponent} from './user/user-transaction-button-set/user-transaction-modal/user-transaction-modal.component';
import {SettingsService} from './shared/settings.service';
import { TallyListSearchComponent } from './tally-list/tally-list-search/tally-list-search.component';
import {SettingsResolver} from './shared/settings.resolver';

@NgModule({
  declarations: [
    AppComponent,
    AlertsComponent,
    TallyListComponent,
    UserComponent,
    UserDetailsComponent,
    UserTransactionsComponent,
    UserCreateComponent,
    UserTransactionButtonComponent,
    UserTransactionButtonSetComponent,
    UserTransactionModalComponent,
    TallyListSearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    Routing,
    ModalModule
  ],
  providers: [AlertsService, UserService, TransactionService, SettingsService, SettingsResolver],
  bootstrap: [AppComponent]
})
export class AppModule {
}
