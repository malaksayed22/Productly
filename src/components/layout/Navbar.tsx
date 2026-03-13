import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, User, Settings, LogOut, ChevronDown, Activity } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminStore } from "../../store/adminStore";

const getInitialDarkMode = (): boolean => {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem("theme");
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const applyDark = (dark: boolean) => {
  if (dark) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

const Navbar: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(getInitialDarkMode);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const profile = useAdminStore((s) => s.profile);
  const logout = useAdminStore((s) => s.logout);

  useEffect(() => {
    applyDark(isDark);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    applyDark(next);
  };

  const handleSignOut = () => {
    setDropdownOpen(false);
    logout();
    toast.success("Signed out");
    navigate("/login");
  };

  const dropdownItems = [
    { icon: User, label: "My Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: Activity, label: "Activity Log", path: "/profile?tab=activity" },
  ];

  return (
    <header
      style={{
        backgroundColor: "rgba(15,15,19, 0.15)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
      className="sticky top-0 z-40 w-full"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          {/* Logo mark */}
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "var(--accent)" }}
          >
            <svg
              className="h-4 w-4 text-white"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 1 L15 5 L15 11 L8 15 L1 11 L1 5 Z" />
            </svg>
          </div>
          <span
            className="font-heading text-lg font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Productly
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              [
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
                isActive ? "font-semibold border-b-2" : "hover:opacity-80",
              ].join(" ")
            }
            style={({ isActive }) => ({
              color: isActive ? "var(--accent)" : "var(--text-secondary)",
              borderColor: isActive ? "var(--accent)" : "transparent",
            })}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              [
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
                isActive ? "font-semibold border-b-2" : "hover:opacity-80",
              ].join(" ")
            }
            style={({ isActive }) => ({
              color: isActive ? "var(--accent)" : "var(--text-secondary)",
              borderColor: isActive ? "var(--accent)" : "transparent",
            })}
          >
            <Package size={16} />
            Products
          </NavLink>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            {/* Trigger */}
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all duration-200 hover:opacity-80"
              aria-label="Open profile menu"
              aria-expanded={dropdownOpen}
            >
              {/* Avatar */}
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full font-heading text-sm font-bold text-white"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                ) : (
                  profile.name.charAt(0).toUpperCase()
                )}
              </div>
              {/* Name (hidden on mobile) */}
              <span
                className="hidden text-sm font-medium sm:block"
                style={{ color: "var(--text-primary)" }}
              >
                {profile.name}
              </span>
              <ChevronDown
                size={16}
                className="transition-transform duration-200"
                style={{
                  color: "var(--text-secondary)",
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-2xl p-2"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.24)",
                  animation: "scale-in 0.15s ease both",
                  transformOrigin: "top right",
                }}
              >
                {/* Header */}
                <div
                  className="mb-2 flex items-center gap-3 px-3 pb-3"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full font-heading text-base font-bold text-white"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                    ) : (
                      profile.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="truncate font-heading text-sm font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {profile.name}
                    </p>
                    <p
                      className="truncate text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {profile.email}
                    </p>
                  </div>
                </div>

                {/* Nav items */}
                {dropdownItems.map(({ icon: Icon, label, path }) => (
                  <button
                    key={label}
                    onClick={() => { setDropdownOpen(false); navigate(path); }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-150"
                    style={{ color: "var(--text-primary)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-tertiary)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
                    }
                  >
                    <Icon size={15} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
                    {label}
                  </button>
                ))}

                {/* Divider */}
                <div className="my-1.5 mx-2" style={{ borderBottom: "1px solid var(--border)" }} />

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150"
                  style={{ color: "var(--c-danger)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(239,68,68,0.08)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
                  }
                >
                  <LogOut size={15} style={{ flexShrink: 0 }} />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 hover:opacity-80 active:scale-95"
            style={{
              background: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            {isDark ? (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
