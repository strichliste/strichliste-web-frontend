// Domain types for the `article` resource. Data fetching/mutations live in
// TanStack Query (see src/queries/articles.ts).

export type Barcode = {
  id: number;
  barcode: string;
  created: string;
};

export type Tag = {
  id: number;
  tag: string;
  created: string;
};

export interface Article {
  id: number;
  name: string;
  barcodes: Barcode[];
  tags: Tag[];
  amount: number;
  isActive: boolean;
  usageCount: number;
  precursor?: Article;
  created: string;
}
