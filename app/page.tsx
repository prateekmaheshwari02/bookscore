"use client";

import { ArrowRight, BrainCircuit, Check, CheckCircle2, Gauge, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import type { QuizPayload } from "@/lib/types";

const signals = [
  { label: "Concepts", icon: BrainCircuit },
  { label: "Depth", icon: Gauge },
  { label: "Retention", icon: Sparkles }
];

const trustSignals = ["5 minutes", "Personalized for your book", "No sign-up", "Instant score"];

const loadingSteps = [
  "Checking your book...",
  "Finding core ideas",
  "Building plausible choices",
  "Checking conceptual depth",
  "Preparing your quiz"
];

type GenerateQuizError = {
  error?: string;
  examples?: string[];
};

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [error, setError] = useState("");
  const [examples, setExamples] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      return;
    }

    const interval = window.setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 94) return currentProgress;

        const nextStep = currentProgress < 55 ? 7 : currentProgress < 78 ? 4 : 2;
        return Math.min(currentProgress + nextStep, 94);
      });
    }, 650);

    return () => window.clearInterval(interval);
  }, [loading]);

  async function startQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = userName.trim();
    const trimmedTitle = bookTitle.trim();
    setExamples([]);

    if (!trimmedName) {
      setError("Enter your name to begin.");
      return;
    }

    if (!trimmedTitle) {
      setError("Enter a book title to begin.");
      return;
    }

    setProgress(8);
    setLoading(true);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: trimmedName, bookName: trimmedTitle })
      });

      const payload = await response.json();
      if (!response.ok) {
        const errorPayload = payload as GenerateQuizError;
        setExamples(errorPayload.examples || []);
        throw new Error(errorPayload.error || "Could not generate the quiz.");
      }

      sessionStorage.setItem("bookscore-quiz", JSON.stringify(payload as QuizPayload));
      sessionStorage.removeItem("bookscore-result");
      sessionStorage.setItem("bookscore-demo-mode", payload.demoMode ? "true" : "false");
      if (payload.warning) {
        sessionStorage.setItem("bookscore-warning", payload.warning);
      } else {
        sessionStorage.removeItem("bookscore-warning");
      }

      router.push("/quiz");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not generate the quiz.");
    } finally {
      setLoading(false);
    }
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
                  setExamples([]);
                }}
                placeholder="Enter book title..."
                disabled={loading}
                className="focus-ring min-h-16 rounded-lg border border-zinc-200 bg-white px-5 text-lg shadow-soft outline-none transition placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:placeholder:text-zinc-500 sm:text-xl"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Your name</span>
              <input
                value={userName}
                onChange={(event) => {
                  setUserName(event.target.value);
                  setError("");
                  setExamples([]);
                }}
                placeholder="Enter your name..."
                disabled={loading}
                className="focus-ring min-h-12 rounded-lg border border-zinc-200 bg-white px-4 text-base shadow-sm outline-none transition placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:placeholder:text-zinc-500"
              />
            </label>

            {error ? (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">
                <p>{error}</p>
                {examples.length ? <p className="mt-2">Try: {examples.join(", ")}</p> : null}
              </div>
            ) : null}

            {loading ? <QuizGenerationProgress progress={progress} bookName={bookTitle} /> : null}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={loading}
                className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                {loading ? (progress < 20 ? "Checking your book..." : "Working on your quiz") : "Test My Retention"}
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

function QuizGenerationProgress({ progress, bookName }: { progress: number; bookName: string }) {
  const activeStep = Math.min(Math.floor(progress / 20), loadingSteps.length - 1);

  return (
    <div className="grid gap-4 rounded-lg border border-sage/20 bg-sage/5 p-4 dark:border-orange-300/20 dark:bg-orange-300/5" role="status" aria-live="polite">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-rust/10 text-rust dark:bg-orange-300/10 dark:text-orange-300">
            <Sparkles size={19} className="animate-pulse" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">{loadingSteps[activeStep]}</p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{bookName ? `Crafting questions for ${bookName}` : "Crafting your quiz"}</p>
          </div>
        </div>
        <span className="text-sm font-semibold text-sage dark:text-orange-300">{progress}%</span>
      </div>

      <div className="h-3 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
        <div className="h-full rounded-lg bg-sage transition-all duration-700 ease-out dark:bg-orange-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="grid gap-2">
        {loadingSteps.map((step, index) => {
          const complete = index < activeStep;
          const active = index === activeStep;

          return (
            <div
              key={step}
              className={`flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                complete
                  ? "bg-sage/10 text-sage dark:bg-orange-300/10 dark:text-orange-300"
                  : active
                    ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                    : "bg-transparent text-zinc-400 dark:text-zinc-500"
              }`}
            >
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${complete ? "bg-sage text-white dark:bg-orange-300 dark:text-zinc-950" : "border border-current"}`}>
                {complete ? <Check size={13} /> : index + 1}
              </span>
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
