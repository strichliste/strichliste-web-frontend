import {FormControl} from '@angular/forms';
import {SettingsInterface} from '../../../shared/settings.interface';

export class CustomTransactionValidator {

  settings:SettingsInterface;
  positive: boolean;

  constructor(settings:SettingsInterface, positive) {
    this.settings = settings;
    this.positive = positive;
  }

  exceedsUpperLimit(value) {
    return value > this.settings.boundaries.upper;

  }

  exceedsLowerLimit(value) {
    return value < this.settings.boundaries.lower;

  }

  exceedsOrEqualsUpperLimit(value) {
    return value >= this.settings.boundaries.upper;

  }

  exceedsOrEqualsLowerLimit(value) {
    return value <= this.settings.boundaries.lower;
  }

  transactionValidator(control: FormControl): { [s: string]: boolean } {
    // if (this.settings && this.settings.boundaries && (control.value > this.settings.boundaries.upper)) {
      return {exceedsLowerLimit: true};
    // }
  }
}
