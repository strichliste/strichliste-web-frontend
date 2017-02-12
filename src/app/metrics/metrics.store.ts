import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MetricsInterface} from './metrics.interface';
/**
 * Created by Tobias on 23.01.2017.
 */
@Injectable()
export class MetricsStore {

  state;
  state$: BehaviorSubject<any>;

  constructor() {
    this.state = {
      avgBalance: 0,
      countTransactions: 0,
      countUsers: 0,
      days: [],
      overallBalance: 0
    };

    this.state$ = new BehaviorSubject(this.state);
  }
}
