export interface Product {
  id: string;
  url: string;
  name: string;
  initialPrice: number;
  currentPrice: number;
  createdAt: string;
  updatedAt: string;
  history?: HistoryRecord[];
}

export interface HistoryRecord {
  id: string;
  productId: string;
  price: number;
  date: string;
}
