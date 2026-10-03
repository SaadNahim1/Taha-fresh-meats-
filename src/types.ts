export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  categoryId: string;
  isPerKg: boolean;
  step: number;
  badge?: string;
  popular?: boolean;
  outOfStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  shortName: string;
  iconName: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerOrderInfo {
  name: string;
  phone: string;
  orderType: 'delivery' | 'pickup';
  address: string;
  paymentMethod: string;
  notes: string;
}
