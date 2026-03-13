import React from "react";
import Layout from "../components/layout/Layout";
import useDashboardStats from "../hooks/useDashboardStats";
import StatsCards from "../components/dashboard/StatsCards";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";
import StockOverview from "../components/dashboard/StockOverview";
import PriceRangeDistribution from "../components/dashboard/PriceRangeDistribution";
import TopProducts from "../components/dashboard/TopProducts";
import RecentProducts from "../components/dashboard/RecentProducts";
import QuickActions from "../components/dashboard/QuickActions";

const todayLabel = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "2-digit",
  year: "numeric",
});

const pageStyle: React.CSSProperties = {
  animation: "fadeInUp 0.4s ease forwards",
};

const DashboardPage: React.FC = () => {
  const stats = useDashboardStats();

  return (
    <Layout>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="mx-auto w-full max-w-[1400px] px-6 py-8"
        style={pageStyle}
      >
        {/* ── 1. Page Header ── */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1
              className="font-heading text-3xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Dashboard
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Here's what's happening with your products today
            </p>
          </div>

          <div
            className="rounded-xl px-4 py-2 text-sm"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              whiteSpace: "nowrap",
            }}
          >
            {todayLabel}
          </div>
        </div>

        {/* ── 2. Stats Cards ── */}
        <StatsCards
          stats={{
            totalProducts: stats.totalProducts,
            inStockCount: stats.inStockCount,
            outOfStockCount: stats.outOfStockCount,
            totalValue: stats.totalValue,
          }}
        />

        {/* ── 3. Category Breakdown + Quick Actions ── */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CategoryBreakdown categoryStats={stats.categoryStats} />
          </div>
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>

        {/* ── 4. Stock Overview ── */}
        <div className="mt-6">
          <StockOverview categoryStats={stats.categoryStats} />
        </div>

        {/* ── 5. Price Distribution + Top Products ── */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PriceRangeDistribution priceBuckets={stats.priceBuckets} />
          <TopProducts
            topExpensive={stats.topExpensive}
            topRated={stats.topRated}
          />
        </div>

        {/* ── 6. Recent Products ── */}
        <div className="mt-6">
          <RecentProducts recentProducts={stats.recentProducts} />
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
