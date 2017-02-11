import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertsService} from '../../shared/alerts/alerts.service';
import {AlertModel} from '../../shared/alerts/alert.model';
import {UserStore} from '../user.store';

@Component({
  selector: 'tally-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class UserCreateComponent implements OnInit {

  createUserFormGroup: FormGroup;

  constructor(private router: Router, fb: FormBuilder, private store: UserStore, private alertsService: AlertsService) {
    this.createUserFormGroup = fb.group({
      name: ['',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(24)
        ]
      ]
    });
  }

  ngOnInit() {
  }

  createUser(name: string) {
    this.store.addUser(name).then(userId => {
      if (userId) {
        this.router.navigate(['/user', userId]);
      } else {
        this.alertsService.add(new AlertModel('danger', 'Oh noes ;( could not create user'))
      }
    }, err => {
      this.alertsService.add(new AlertModel('danger', err))
    });
  }
}
