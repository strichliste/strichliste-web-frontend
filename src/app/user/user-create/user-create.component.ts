import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {FormGroup, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertsService} from '../../shared/alerts/alerts.service';
import {AlertModel} from '../../shared/alerts/alert.model';

@Component({
  selector: 'tally-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.less']
})
export class UserCreateComponent implements OnInit {

  createUserFormGroup: FormGroup;

  constructor(private router:Router, fb: FormBuilder, private userService: UserService, private alertsService:AlertsService) {
    this.createUserFormGroup = fb.group({
      name: ['']
    });
  }

  ngOnInit() {
  }

  createUser(name:string) {
    this.userService.createUser(name).toPromise().then(res => {
      if (res && res.id) {
        this.router.navigate(['/user', res.id]);
      } else {
        this.alertsService.add(new AlertModel('danger', res))
      }
    }, err => {
      this.alertsService.add(new AlertModel('danger', err))
    });
  }
}
