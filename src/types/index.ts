export interface Product {
  id:         string;
  name:       string;
  barcode?:   string;
  price:      number;
  stock:      number;
  imageUrl?:  string;
  isActive:   boolean;
  categoryId: string;
  category:   Category;
}

export interface Category {
  id:   string;
  name: string;
}

export interface Order {
  id:            string;
  orderNumber:   string;
  status:        string;
  subtotal:      number;
  discount:      number;
  tax:           number;
  total:         number;
  paymentMethod: string;
  amountPaid:    number;
  change:        number;
  createdAt:     string;
  cashier:       { name: string };
  items:         OrderItem[];
}

export interface OrderItem {
  id:        string;
  quantity:  number;
  unitPrice: number;
  subtotal:  number;
  product:   { name: string };
}