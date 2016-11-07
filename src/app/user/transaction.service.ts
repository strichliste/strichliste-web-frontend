import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {TallyConfig} from '../shared/tally.config';

@Injectable()
export class TransactionService {

  constructor(private http: Http) {
  }

  addTransaction(userId, value) {
    return this.http.post(`${TallyConfig.URL}user/${userId}/transaction`, {value}).map(res => res.json());
  }

  getTransactions(userId, limit, offset) {
    let params = new URLSearchParams();
    params.set('limit', limit);
    params.set('offset', offset);

    return this.http.get(`${TallyConfig.URL}user/${userId}/transaction`, {search: params})
      .map(res => res.json());
  }
}
