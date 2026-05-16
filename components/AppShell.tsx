"use client";

import { BookOpenCheck, Moon, Sun } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = window.localStorage.getItem("bookscore-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedMode ? savedMode === "dark" : prefersDark;

    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  useEffect(() => {
    const trackedKey = "bookscore-visitor-tracked";
    const visitorKey = "bookscore-visitor-id";

    if (window.localStorage.getItem(trackedKey)) {
      return;
    }

    const visitorId = window.localStorage.getItem(visitorKey) || crypto.randomUUID();
    window.localStorage.setItem(visitorKey, visitorId);

    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId,
        path: window.location.pathname
      }),
      keepalive: true
    })
      .then(() => window.localStorage.setItem(trackedKey, "true"))
      .catch(() => undefined);
  }, []);

  function toggleDarkMode() {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    document.documentElement.classList.toggle("dark", nextMode);
    window.localStorage.setItem("bookscore-theme", nextMode ? "dark" : "light");
  }

  return (
    <main className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-paper dark:bg-zinc-100 dark:text-zinc-950">
            <BookOpenCheck size={20} />
          </span>
          BookScore
        </Link>
        <button
          type="button"
          onClick={toggleDarkMode}
          className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>
      {children}
    </main>
  );
}
