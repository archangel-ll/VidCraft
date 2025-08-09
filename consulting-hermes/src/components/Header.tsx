"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function Header() {
  const { currentUser, credits, logout } = useApp();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-gradient-to-br from-slate-900 to-sky-400" aria-hidden />
          <span className="text-lg font-bold">Consulting Hermes</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900">Pricing</Link>
          {currentUser ? (
            <>
              <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">Dashboard</Link>
              <Badge>Credits: {credits}</Badge>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900">Login</Link>
              <Link href="/signup" className="text-sm text-white bg-sky-400 hover:bg-sky-500 px-3 py-1.5 rounded-md">Start Free</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}