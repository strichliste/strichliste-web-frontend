// Domain types for the `transaction` resource. Data fetching/mutations live in
// TanStack Query (see src/queries/transactions.ts).
import { User } from './user';
import { Article } from './article';

export interface Transaction {
  id: number;
  user: User;
  article?: Article;
  sender?: User;
  recipient?: User;
  comment?: string;
  amount: number;
  created: string;
  isDeleted: boolean;
  isDeletable: boolean;
}

export interface CreateTransactionParams {
  amount?: number;
  articleId?: number;
  recipientId?: string;
  comment?: string;
}
