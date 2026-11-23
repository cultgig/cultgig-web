import {
  Bell,
  BookmarkSimple,
  Briefcase,
  CalendarCheck,
  CalendarDots,
  ChatCircleText,
  CurrencyInr,
  FileText,
  Gear,
  HandCoins,
  House,
  ImagesSquare,
  MagnifyingGlass,
  Receipt,
  Storefront,
  UserCircle,
  UsersThree,
  type Icon,
} from "@phosphor-icons/react";
import type { MarketplaceRole } from "@/types/marketplace";

export interface WorkspaceNavItem {
  label: string;
  path: string;
  icon: Icon;
  /** Shown in the mobile bottom bar (max 4 + "More"). */
  mobile?: boolean;
  badge?: "messages" | "notifications" | "proposals";
}

export const workspaceNav: Record<MarketplaceRole, WorkspaceNavItem[]> = {
  artist: [
    { label: "Dashboard", path: "/artist/dashboard", icon: House, mobile: true },
    { label: "My profile", path: "/artist/profile", icon: UserCircle },
    { label: "Portfolio", path: "/artist/portfolio", icon: ImagesSquare },
    { label: "My services", path: "/artist/services", icon: Storefront },
    { label: "Discover gigs", path: "/artist/gigs", icon: MagnifyingGlass, mobile: true },
    { label: "My applications", path: "/artist/applications", icon: FileText },
    { label: "Proposals", path: "/artist/proposals", icon: HandCoins, badge: "proposals" },
    { label: "Messages", path: "/messages", icon: ChatCircleText, mobile: true, badge: "messages" },
    { label: "Bookings", path: "/artist/bookings", icon: CalendarCheck, mobile: true },
    { label: "Availability", path: "/artist/availability", icon: CalendarDots },
    { label: "Earnings", path: "/artist/earnings", icon: CurrencyInr },
    { label: "Notifications", path: "/notifications", icon: Bell, badge: "notifications" },
    { label: "Settings", path: "/settings", icon: Gear },
  ],
  client: [
    { label: "Dashboard", path: "/client/dashboard", icon: House, mobile: true },
    { label: "Find artists", path: "/explore", icon: MagnifyingGlass, mobile: true },
    { label: "Saved artists", path: "/client/saved", icon: BookmarkSimple },
    { label: "My gigs", path: "/client/gigs", icon: Briefcase },
    { label: "Applications", path: "/client/applications", icon: UsersThree },
    { label: "Messages", path: "/messages", icon: ChatCircleText, mobile: true, badge: "messages" },
    { label: "Bookings", path: "/client/bookings", icon: CalendarCheck, mobile: true },
    { label: "Payments", path: "/client/payments", icon: Receipt },
    { label: "Notifications", path: "/notifications", icon: Bell, badge: "notifications" },
    { label: "Settings", path: "/settings", icon: Gear },
  ],
};
