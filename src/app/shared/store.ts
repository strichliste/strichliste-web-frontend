import {BehaviorSubject} from 'rxjs';
/**
 * Created by Tobias on 08.02.2017.
 */
export class store {
  state;
  store$;

  constructor(){
    this.state = {};
    this.store$ = new BehaviorSubject(this.state);
  }

  update(newState){
    this.store$.next(newState);
  }
}
