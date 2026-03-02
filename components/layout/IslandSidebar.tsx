"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarRange,
  ShoppingCart,
  Users,
  Settings,
  Wrench,
  Package,
  ListOrdered,
  UserCog,
  Wallet,
  Heart,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeStore, type AvatarId } from "@/store/theme-store";
import { UserCircle, Shield, Crown, Star } from "lucide-react";

const AVATAR_ICONS: Record<AvatarId, typeof UserCircle> = {
  avatar1: UserCircle,
  avatar2: Shield,
  avatar3: Crown,
  avatar4: Star,
};

interface NavChild {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  href?: string;
  children?: NavChild[];
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    id: "mis-cosas",
    label: "Mis Cosas",
    icon: CalendarRange,
    children: [
      { href: "/mis-cosas", label: "Planner", icon: Heart },
      { href: "/mis-cosas/gastos", label: "Gastos personales", icon: Receipt },
    ],
  },
  {
    id: "pedidos",
    label: "Pedidos",
    icon: ShoppingCart,
    children: [
      { href: "/pedidos", label: "Pedidos a proveedores", icon: Package },
      { href: "/pedidos/items", label: "Items", icon: ListOrdered },
    ],
  },
  {
    id: "equipo",
    label: "Equipo",
    icon: Users,
    children: [
      { href: "/equipo/personal", label: "Personal", icon: UserCog },
      { href: "/equipo/remuneraciones", label: "Remuneraciones", icon: Wallet },
    ],
  },
  {
    id: "configuracion",
    label: "Configuracion",
    icon: Settings,
    href: "/configuracion",
  },
];

export function IslandSidebar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const { userProfile } = useThemeStore();

  const AvatarIcon = AVATAR_ICONS[userProfile.avatar] || UserCircle;

  function isActive(item: NavItem): boolean {
    if (item.href) return pathname === item.href;
    if (item.children)
      return item.children.some((c) => pathname.startsWith(c.href));
    return false;
  }

  function isChildActive(href: string): boolean {
    return pathname === href;
  }

  return (
    <div
      className="fixed left-3 top-3 bottom-3 z-50 flex"
      onMouseEnter={() => setSidebarHovered(true)}
      onMouseLeave={() => {
        setSidebarHovered(false);
        setHoveredItem(null);
      }}
    >
      {/* Island bar */}
      <div
        className={cn(
          "flex flex-col items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl transition-all duration-300 overflow-hidden",
          sidebarHovered ? "w-[240px]" : "w-[64px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-5 w-full">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/15">
            <Wrench className="h-5 w-5 text-[var(--color-accent)]" />
          </div>
          <span
            className={cn(
              "text-lg font-extrabold tracking-tight text-[var(--color-text)] whitespace-nowrap transition-opacity duration-200",
              sidebarHovered ? "opacity-100" : "opacity-0 w-0"
            )}
          >
            MAAK
          </span>
        </div>

        {/* Divider */}
        <div className="mx-3 mb-2 h-px w-[calc(100%-24px)] bg-[var(--color-border)]" />

        {/* Nav items */}
        <nav className="flex-1 w-full px-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            const isHovered = hoveredItem === item.id;

            if (item.href) {
              // Simple link
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 group",
                    active
                      ? "bg-[var(--color-accent)]/12 text-[var(--color-accent)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span
                    className={cn(
                      "text-sm font-medium whitespace-nowrap transition-opacity duration-200",
                      sidebarHovered ? "opacity-100" : "opacity-0 w-0"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            }

            // Item with children
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 cursor-default",
                    active
                      ? "bg-[var(--color-accent)]/12 text-[var(--color-accent)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span
                    className={cn(
                      "text-sm font-medium whitespace-nowrap transition-opacity duration-200",
                      sidebarHovered ? "opacity-100" : "opacity-0 w-0"
                    )}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Sub-items — shown when sidebar is hovered AND this item is hovered/active */}
                {sidebarHovered && (isHovered || active) && item.children && (
                  <div className="ml-5 mt-0.5 space-y-0.5 border-l border-[var(--color-border)] pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150",
                          isChildActive(child.href)
                            ? "text-[var(--color-accent)] bg-[var(--color-accent)]/8"
                            : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]"
                        )}
                      >
                        <child.icon className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="whitespace-nowrap">{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User profile at bottom */}
        <div className="mx-3 mt-2 h-px w-[calc(100%-24px)] bg-[var(--color-border)]" />
        <div className="flex items-center gap-2.5 px-4 py-4 w-full">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/15">
            <AvatarIcon className="h-5 w-5 text-[var(--color-accent)]" />
          </div>
          <div
            className={cn(
              "min-w-0 transition-opacity duration-200",
              sidebarHovered ? "opacity-100" : "opacity-0 w-0"
            )}
          >
            <p className="text-sm font-medium text-[var(--color-text)] truncate">
              {userProfile.name}
            </p>
            <p className="text-[10px] text-[var(--color-muted)]">
              Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
