"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

interface SimpleHeaderProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export default function SimpleHeader({ onLoginClick, onSignupClick }: SimpleHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#faf7f2] border-b border-black/10">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
          {/* LEFT – LOGO */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-pink-500">Giftly ❤️</span>
              <span className="text-xl"></span>
            </Link>
          </div>

          {/* CENTER – NAV (Desktop) */}
          <div className="hidden md:flex items-center gap-6 justify-self-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-black text-black/60"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* RIGHT – AUTH + THEME + MOBILE */}
          <div className="flex items-center gap-2 md:justify-self-end">
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onLoginClick}
                className="h-9 px-4 inline-flex items-center justify-center rounded-md border border-black/20 text-sm font-medium hover:bg-black/5 transition"
              >
                Log in
              </button>

              <button
                onClick={onSignupClick}
                className="h-9 px-4 inline-flex items-center justify-center rounded-md bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 transition"
              >
                Sign up
              </button>
            </div>

            <ThemeToggle />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/20 hover:bg-black/5"
            >
              {open ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M3.75 5.25h16.5a.75.75 0 010 1.5H3.75a.75.75 0 010-1.5zm0 6h16.5a.75.75 0 010 1.5H3.75a.75.75 0 010-1.5zm0 6h16.5a.75.75 0 010 1.5H3.75a.75.75 0 010-1.5z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-96" : "max-h-0"}`}>
          <div className="border-t border-black/10 pt-3 pb-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-black/5">
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 px-3 pt-2">
              <button onClick={onLoginClick} className="flex-1 h-9 inline-flex items-center justify-center rounded-md border border-black/20 text-sm font-medium">Log in</button>
              <button onClick={onSignupClick} className="flex-1 h-9 inline-flex items-center justify-center rounded-md bg-pink-500 text-white text-sm font-semibold">Sign up</button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
