import { useMemo } from "react";
import type { Product } from "../types/product";
import type {
  DashboardStats,
  CategoryStat,
  PriceBucket,
  TopProduct,
} from "../types/dashboard";
import { useProductsStore } from "../store/productsStore";

const PRICE_BUCKETS: Pick<PriceBucket, "range" | "min" | "max">[] = [
  { range: "$0 - $25", min: 0, max: 25 },
  { range: "$25 - $50", min: 25, max: 50 },
  { range: "$50 - $100", min: 50, max: 100 },
  { range: "$100 - $200", min: 100, max: 200 },
  { range: "$200+", min: 200, max: Infinity },
];

const toTopProduct = (p: Product): TopProduct => ({
  id: p.id,
  title: p.title,
  price: p.price,
  image: p.image,
  category: p.category,
  rating: p.rating,
  inStock: p.inStock,
});

const useDashboardStats = (): DashboardStats => {
  const allProducts = useProductsStore((s) => s.allProducts);

  return useMemo(() => {
    const products = allProducts;

    // ── Totals ────────────────────────────────────────────
    const totalProducts = products.length;
    const inStockCount = products.filter(
      (p) => p.inStock && p.stockCount > 0,
    ).length;
    const outOfStockCount = products.filter(
      (p) => !p.inStock || p.stockCount === 0,
    ).length;
    const totalValue = parseFloat(
      products.reduce((sum, p) => sum + p.price, 0).toFixed(2),
    );

    // ── Category stats ────────────────────────────────────
    const categoryMap = new Map<string, Product[]>();
    for (const p of products) {
      const existing = categoryMap.get(p.category) ?? [];
      existing.push(p);
      categoryMap.set(p.category, existing);
    }

    const categoryStats: CategoryStat[] = Array.from(categoryMap.entries())
      .map(([category, items]) => {
        const count = items.length;
        const avgPrice = parseFloat(
          (items.reduce((s, p) => s + p.price, 0) / count).toFixed(2),
        );
        const inStock = items.filter(
          (p) => p.inStock && p.stockCount > 0,
        ).length;
        const outOfStock = count - inStock;
        return {
          category,
          count,
          avgPrice,
          inStockCount: inStock,
          outOfStockCount: outOfStock,
          inStockPercent: Math.round((inStock / count) * 100),
        };
      })
      .sort((a, b) => b.count - a.count);

    // ── Price buckets ─────────────────────────────────────
    const priceBuckets: PriceBucket[] = PRICE_BUCKETS.map(
      ({ range, min, max }) => {
        const matches = products.filter((p) => p.price >= min && p.price < max);
        return {
          range,
          min,
          max,
          count: matches.length,
          productNames: matches.map((p) => p.title),
        };
      },
    );

    // ── Top lists ─────────────────────────────────────────
    const topExpensive: TopProduct[] = [...products]
      .sort((a, b) => b.price - a.price)
      .slice(0, 5)
      .map(toTopProduct);

    const topRated: TopProduct[] = [...products]
      .sort((a, b) => b.rating.rate - a.rating.rate)
      .slice(0, 5)
      .map(toTopProduct);

    const recentProducts: TopProduct[] = products.slice(-5).map(toTopProduct);

    return {
      totalProducts,
      inStockCount,
      outOfStockCount,
      totalValue,
      categoryStats,
      priceBuckets,
      topExpensive,
      topRated,
      recentProducts,
    };
  }, [allProducts]);
};

export default useDashboardStats;
