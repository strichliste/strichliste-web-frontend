import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {TallyConfig} from '../shared/tally.config';

@Injectable()
export class TransactionService {

  constructor(private http:Http) { }

  addTransaction(userId, value) {
    return this.http.post(`${TallyConfig.URL}user/${userId}/transaction`, {value}).map(res => res.json());
  }
}
