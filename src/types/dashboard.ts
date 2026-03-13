export interface CategoryStat {
  category: string;
  count: number;
  avgPrice: number;
  inStockCount: number;
  outOfStockCount: number;
  inStockPercent: number;
}

export interface PriceBucket {
  range: string;
  count: number;
  productNames: string[];
  min: number;
  max: number;
}

export interface TopProduct {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: { rate: number; count: number };
  inStock: boolean;
}

export interface DashboardStats {
  totalProducts: number;
  inStockCount: number;
  outOfStockCount: number;
  totalValue: number;
  categoryStats: CategoryStat[];
  priceBuckets: PriceBucket[];
  topExpensive: TopProduct[];
  topRated: TopProduct[];
  recentProducts: TopProduct[];
}
