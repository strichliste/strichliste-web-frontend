import {UserInterface} from '../user.interface';
import {TransactionInterface} from '../user-transactions/transaction.interface';

export class UserModel implements UserInterface{
  id: number;
  balance: number;
  lastTransaction: string;
  name: string;
  transactions?: TransactionInterface[];

  constructor(config:any) {
    this.id = config.id;
    this.balance = config.balance || 0;
    this.lastTransaction = config.lastTransaction || null;
    this.name = config.name || '';
    this.transactions = config.transactions || [];
  }
}
