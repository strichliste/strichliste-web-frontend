import {FormControl} from '@angular/forms';
export class TransactionValidators {

  static exceedsUpperLimit(value: number, upper: number): boolean {
    return value > upper;

  }

  static exceedsLowerLimit(value: number, lower: number): boolean {
    return value < lower;

  }

  static exceedsOrEqualsUpperLimit(value: number, upper: number): boolean {
    return value >= upper;

  }

  static exceedsOrEqualsLowerLimit(value: number, lower: number): boolean {
    return value <= lower;
  }

  static checkBoundaries(boundaries: any, balance:number, positive:boolean) {
    return (control: FormControl): {[key: string]: any} => {
      var v: number = Number(control.value);

      v = positive ? v + balance : v - balance;
      console.log(v, balance);
      if (boundaries && TransactionValidators.exceedsUpperLimit(v, boundaries.upper)) {
        return {"exceedsUpperLimit": {"upperLimit": boundaries.upper, "actualValue": v}}
      }

      if (boundaries && TransactionValidators.exceedsLowerLimit(v, boundaries.lower)) {
        return {"exceedsLowerLimit": {"lowerLimit": boundaries.upper, "actualValue": v}}
      }

      return null;
    };
  }

  static isInvalid(formValue:number, balance:number, boundaries:{upper:number, lower:number}, positive:boolean) {
    if (!balance && balance !== 0) {
      return true;
    } else {

      if (positive) {
        const value = Number(formValue) + Number(balance);
        return TransactionValidators.exceedsUpperLimit(value, boundaries.upper);
      } else {
        const value = (Number(formValue) - Number(balance)) * -1;
        return TransactionValidators.exceedsLowerLimit(value, boundaries.lower);
      }
    }
  }
}
