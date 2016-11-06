
import { DayInterface } from './day.interface';
export interface MetricsInterface {
  avgBalance:number;
  countTransactions:number;
  countUsers:number;
  days: DayInterface[];
  overallBalance:number;
}
