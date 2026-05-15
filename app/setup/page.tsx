"use client";

import { Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StepFrame } from "@/components/StepFrame";
import type { QuizPayload } from "@/lib/types";

const loadingSteps = [
  "Reading the book signal",
  "Finding core ideas",
  "Building plausible choices",
  "Checking conceptual depth",
  "Preparing your quiz"
];

export default function SetupPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [bookName, setBookName] = useState("");
  const [error, setError] = useState("");
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setProgress(8);
    setLoading(true);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, bookName })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Could not generate the quiz.");
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
    <StepFrame eyebrow="Quiz setup" title="Tell BookScore what you finished reading.">
      <form onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-soft dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">User Name</span>
          <input
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            placeholder="Priya"
            className="focus-ring min-h-12 rounded-lg border border-zinc-200 bg-white px-4 text-base outline-none transition dark:border-zinc-800 dark:bg-zinc-950"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Book Name</span>
          <input
            value={bookName}
            onChange={(event) => setBookName(event.target.value)}
            placeholder="Atomic Habits"
            className="focus-ring min-h-12 rounded-lg border border-zinc-200 bg-white px-4 text-base outline-none transition dark:border-zinc-800 dark:bg-zinc-950"
            required
          />
        </label>

        {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</p> : null}

        {loading ? <QuizGenerationProgress progress={progress} bookName={bookName} /> : null}

        <PrimaryButton type="submit" loading={loading} className="w-full sm:w-fit">
          {loading ? "Working on your quiz" : "Generate Quiz"}
        </PrimaryButton>
      </form>
    </StepFrame>
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
        <div
          className="h-full rounded-lg bg-sage transition-all duration-700 ease-out dark:bg-orange-300"
          style={{ width: `${progress}%` }}
        />
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
