export interface ProductSeller {
  name: string;
  location: string;
  rating?: number;
  verified?: boolean;
  id?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  seller: ProductSeller;
  stock: number;
  variants?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  tags?: string[];
  shippingTimeInDays?: number;
}
