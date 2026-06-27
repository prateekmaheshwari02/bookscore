"use client";

import { ArrowRight, BrainCircuit, CheckCircle2, Gauge, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AppShell } from "@/components/AppShell";

const signals = [
  { label: "Concepts", icon: BrainCircuit },
  { label: "Depth", icon: Gauge },
  { label: "Retention", icon: Sparkles }
];

const trustSignals = ["5 minutes", "Personalized for your book", "No sign-up", "Instant score"];

export default function HomePage() {
  const router = useRouter();
  const [bookTitle, setBookTitle] = useState("");
  const [error, setError] = useState("");

  function startQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = bookTitle.trim();
    if (!trimmedTitle) {
      setError("Enter a book title to begin.");
      return;
    }

    router.push(`/setup?book=${encodeURIComponent(trimmedTitle)}`);
  }

  return (
    <AppShell>
      <section className="mx-auto grid min-h-[calc(100vh-84px)] w-full max-w-6xl gap-10 px-5 pb-12 pt-6 sm:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rust dark:text-orange-300">BookScore</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-normal text-ink dark:text-white sm:text-7xl">Read more books. Retain them better.</h1>
          <form onSubmit={startQuiz} className="mt-8 grid max-w-2xl gap-4">
            <label className="grid gap-3">
              <span className="text-2xl font-semibold tracking-normal text-ink dark:text-white sm:text-3xl">What&apos;s the last book you finished?</span>
              <input
                value={bookTitle}
                onChange={(event) => {
                  setBookTitle(event.target.value);
                  setError("");
                }}
                placeholder="Enter book title..."
                className="focus-ring min-h-16 rounded-lg border border-zinc-200 bg-white px-5 text-lg shadow-soft outline-none transition placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:placeholder:text-zinc-500 sm:text-xl"
              />
            </label>

            {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</p> : null}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                Test My Retention
                <ArrowRight size={18} />
              </button>
              <div className="grid gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 sm:grid-cols-2">
                {trustSignals.map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-sage dark:text-orange-300" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="max-w-2xl rounded-lg border border-zinc-200 bg-white p-5 shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
          <div className="rounded-lg bg-paper p-5 dark:bg-zinc-950">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Sample scorecard</p>
                <h2 className="text-2xl font-semibold">Atomic Habits</h2>
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-lg bg-sage text-xl font-bold text-white">86</div>
            </div>
            <div className="mt-5 grid gap-3">
              {signals.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center justify-between rounded-lg bg-white px-4 py-3 dark:bg-zinc-900">
                    <span className="flex items-center gap-3 font-medium">
                      <Icon size={18} className="text-rust dark:text-orange-300" />
                      {item.label}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">Strong</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 rounded-lg border border-dashed border-zinc-300 p-4 text-sm leading-6 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
              Revisit systems vs goals, especially how identity-based habits turn repeated choices into durable behavior.
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
