import React from "react";
import Navbar from "./Navbar";
import useProducts from "../../hooks/useProducts";

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Trigger the API fetch on any protected page so the store is
  // always populated regardless of which route the user lands on first.
  useProducts();

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-up">
        {children}
      </main>
    </div>
  );
};

export default Layout;
