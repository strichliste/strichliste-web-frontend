import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserInterface} from '../user.interface';
import {UserStore} from '../user.store';
import {AlertsService} from '../../shared/alerts/alerts.service';
import {AlertModel} from '../../shared/alerts/alert.model';

@Component({
  selector: 'tally-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent implements OnInit {
  user: UserInterface;
  queryParamsSubscribtion: any;
  userSubscription;
  constructor(private route: ActivatedRoute,
              private store: UserStore,
              private cd: ChangeDetectorRef,
              private alertsService: AlertsService) {
  }

  ngOnInit() {
    this.queryParamsSubscribtion = this.route.params.subscribe((param) => {
      this.getUserDetails(param['id']);
    });

    this.userSubscription = this.store.store$.map((res) => res.selectedUser).subscribe((user) => {
      this.user = user;
      this.cd.markForCheck();
    });
  }

  getUserDetails(id) {
    this.store.getUserDetails(id)
      .then(() => {
      }, (err) => {
        this.alertsService.add(new AlertModel('danger', err));
      });
  }

  refreshUserDetails() {
    this.getUserDetails(this.user.id);
  }

  ngOnDestroy() {
    this.queryParamsSubscribtion.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
