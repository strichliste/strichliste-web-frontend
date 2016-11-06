import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {AlertsComponent} from './shared/alerts/alerts.component';
import {AlertsService} from './shared/alerts/alerts.service';
import {Routing} from './app.routing';
import { TallyListComponent } from './tally-list/tally-list.component';
import { UserComponent } from './user/user.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { UserTransactionsComponent } from './user/user-transactions/user-transactions.component';
import {UserService} from './user/user.service';

@NgModule({
  declarations: [
    AppComponent,
    AlertsComponent,
    TallyListComponent,
    UserComponent,
    UserDetailsComponent,
    UserTransactionsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Routing
  ],
  providers: [AlertsService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
