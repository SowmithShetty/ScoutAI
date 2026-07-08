"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Search,
  Users,
  BookmarkCheck,
  ArrowLeftRight,
  HeartPulse,
  BarChart3,
  DollarSign,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Shield,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

// ─── Sidebar Navigation Items ────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/scouting", label: "Scouting", icon: Search },
  { href: "/dashboard/players", label: "Players", icon: Users },
  { href: "/dashboard/shortlists", label: "Shortlists", icon: BookmarkCheck },
  { href: "/dashboard/transfers", label: "Transfer Market", icon: ArrowLeftRight },
  { href: "/dashboard/medical", label: "Medical", icon: HeartPulse },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/financial", label: "Financial", icon: DollarSign },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

// ─── Sidebar Component ──────────────────────────────────────────────────────

function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  const { logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 bg-navy border-r border-border
          transition-all duration-300 ease-in-out flex flex-col
          ${collapsed ? "w-[72px]" : "w-[260px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-border shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-electric to-emerald flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-text-primary text-lg"
              >
                ScoutAI
              </motion.span>
            )}
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 group relative
                  ${
                    isActive
                      ? "bg-electric/10 text-electric-bright"
                      : "text-text-muted hover:text-text-primary hover:bg-surface/50"
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-electric rounded-r-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon
                  className={`w-5 h-5 shrink-0 ${isActive ? "text-electric-bright" : "text-text-muted group-hover:text-text-secondary"}`}
                />
                {!collapsed && <span>{item.label}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-surface rounded-md text-xs text-text-primary opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity shadow-lg z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Log Out Button */}
        <div className="px-3 py-1 border-t border-border/50 shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-coral hover:bg-coral/10 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>

        {/* Collapse Button */}
        <div className="p-3 border-t border-border shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface/50 transition-colors text-sm"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Navbar Component ────────────────────────────────────────────────────────

function Navbar({
  collapsed,
  setMobileOpen,
}: {
  collapsed: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const [searchFocused, setSearchFocused] = useState(false);
  const { user } = useAuth();

  return (
    <header
      className={`
        fixed top-0 right-0 h-16 z-30 bg-midnight/80 backdrop-blur-xl border-b border-border
        flex items-center justify-between px-6 transition-all duration-300
        ${collapsed ? "left-[72px]" : "left-[260px]"}
        max-lg:left-0
      `}
    >
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden text-text-muted hover:text-text-primary transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          className={`
            relative transition-all duration-300
            ${searchFocused ? "w-80" : "w-64"}
            max-sm:w-40
          `}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search players, clubs, reports..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="input-field pl-9 py-2 text-sm bg-navy/80"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg bg-surface/50 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-coral rounded-full text-[10px] text-white flex items-center justify-center font-bold">
            3
          </span>
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface/50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric to-purple flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-text-primary leading-tight">
              {user?.full_name || "Demo User"}
            </p>
            <p className="text-xs text-text-muted leading-tight capitalize">
              {user?.role || "Scout"}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}

// ─── Dashboard Layout ────────────────────────────────────────────────────────

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-electric/30 border-t-electric rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <Navbar collapsed={sidebarCollapsed} setMobileOpen={setMobileOpen} />

      {/* Main Content */}
      <main
        className={`
          pt-16 min-h-screen transition-all duration-300
          ${sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[260px]"}
        `}
      >
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
