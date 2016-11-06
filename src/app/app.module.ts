import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {AlertsComponent} from './shared/alerts/alerts.component';
import {AlertsService} from './shared/alerts/alerts.service';
import {Routing} from './app.routing';
import { TallyListComponent } from './tally-list/tally-list.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertsComponent,
    TallyListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Routing
  ],
  providers: [AlertsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
