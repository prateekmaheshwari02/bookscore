import { ArrowRight, BrainCircuit, Gauge, Sparkles } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";

const signals = [
  { label: "Concepts", icon: BrainCircuit },
  { label: "Depth", icon: Gauge },
  { label: "Retention", icon: Sparkles }
];

export default function HomePage() {
  return (
    <AppShell>
      <section className="mx-auto grid min-h-[calc(100vh-84px)] w-full max-w-6xl items-center gap-10 px-5 pb-12 pt-6 sm:px-8 lg:grid-cols-[1fr_0.78fr]">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rust dark:text-orange-300">BookScore</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-normal text-ink dark:text-white sm:text-7xl">Read more books. Retain them better.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            A focused quiz experience that measures whether you understood the ideas of a non-fiction book, not whether you remember stray facts.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/setup"
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
            >
              Start Quiz
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
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
