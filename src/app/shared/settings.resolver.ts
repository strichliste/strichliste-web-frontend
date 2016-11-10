import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import {SettingsService} from './settings.service';

@Injectable()
export class SettingsResolver implements Resolve<any> {
    constructor(
        private settingsService: SettingsService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this.settingsService.getSettings();
    }
}
