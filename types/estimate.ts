export interface EstimateItem {
  id: string;
  si: number;
  description: string;
  picture?: string;
  designNumber: string;
  size: string;
  squareFeet?: number;
  quantity: number;
  amount: number;
}

export interface Estimate {
  estimateNumber: string;
  date: string;
  clientName: string;
  items: EstimateItem[];
  subtotal: number;
  discount: number;
  total: number;
}

