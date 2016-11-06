
import {TransactionInterface} from './user-transactions/transaction.interface';
export interface UserInterface {
  id: number;
  balance: number;
  lastTransaction: string;
  name: string;
  transactions?: TransactionInterface[];
}
