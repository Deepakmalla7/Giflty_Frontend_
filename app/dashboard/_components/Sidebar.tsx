"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import logo from "@/app/assets/images/logo.png";

const menuItems = [
  {
    icon: "📊",
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: "🎁",
    label: "Browse Gifts",
    href: "/dashboard/gifts",
  },
  {
    icon: "💌",
    label: "Send Gift",
    href: "/dashboard/gift",
  },
  {
    icon: "🛒",
    label: "Gift Order",
    href: "/dashboard/orders",
  },
  {
    icon: "❤️",
    label: "Wishlist",
    href: "/dashboard/wishlist",
  },
  {
    icon: "⭐",
    label: "My Reviews",
    href: "/dashboard/feedback",
  },
];

const otherItems = [
  {
    icon: "⚙️",
    label: "Settings",
    href: "/dashboard/settings",
  },
  {
    icon: "👤",
    label: "Accounts",
    href: "/dashboard/accounts",
  },
  {
    icon: "❓",
    label: "Help",
    href: "/dashboard/help",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      // Call logout API to clear cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Redirect to login regardless
      window.location.href = "/login";
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-emerald-600 text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 bg-gradient-to-b from-emerald-700 to-emerald-800 text-white transition-transform duration-300 ease-in-out z-40 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-emerald-600">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Image
                src={logo}
                alt="Giftly logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold">GIFTLY</span>
          </Link>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-6 px-4">
          {/* Main Menu */}
          <div className="mb-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  isActive(item.href)
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-emerald-100 hover:bg-emerald-600/50"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-emerald-600 my-4 pt-4">
            <p className="text-xs font-semibold text-emerald-300 px-4 mb-3 uppercase">Others</p>
          </div>

          {/* Other Items */}
          <div>
            {otherItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  isActive(item.href)
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-emerald-100 hover:bg-emerald-600/50"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-emerald-600">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all font-semibold"
          >
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
