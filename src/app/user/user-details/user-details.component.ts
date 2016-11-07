import {Component, OnInit} from '@angular/core';
import {UserInterface} from '../user.interface';
import {ActivatedRoute} from '@angular/router';
import {AlertModel} from '../../shared/alerts/alert.model';
import {UserService} from '../user.service';
import {AlertsService} from '../../shared/alerts/alerts.service';

@Component({
  selector: 'tally-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.less']
})
export class UserDetailsComponent implements OnInit {
  user: UserInterface;
  queryParamsSubscribtion: any;

  constructor(private route: ActivatedRoute, private userService: UserService, private alertsService: AlertsService) {

  }

  ngOnInit() {
    this.queryParamsSubscribtion = this.route.params.subscribe((param) => {
      this.getUserDetails(param['id']);
    });
  }

  getUserDetails(id) {
    this.userService.getUserDetails(id).toPromise().then((res: UserInterface) => {
      if (res) {
        this.user = res;
      } else {
        this.alertsService.add(new AlertModel('danger', 'no user details found'));
      }
    }, (err) => {
      this.alertsService.add(new AlertModel('danger', err));
    });
  }

  refreshUserDetails() {
    this.getUserDetails(this.user.id);
  }

  ngOnDestroy() {
    this.queryParamsSubscribtion.unsubscribe();
  }
}
