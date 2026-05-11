"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StepFrame } from "@/components/StepFrame";
import type { EvaluationResult, QuizPayload } from "@/lib/types";

export default function ResultsPage() {
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizPayload | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    const savedQuiz = sessionStorage.getItem("bookscore-quiz");
    const savedResult = sessionStorage.getItem("bookscore-result");

    if (!savedQuiz || !savedResult) {
      router.replace("/setup");
      return;
    }

    setQuiz(JSON.parse(savedQuiz) as QuizPayload);
    setResult(JSON.parse(savedResult) as EvaluationResult);
  }, [router]);

  function retakeQuiz() {
    sessionStorage.removeItem("bookscore-quiz");
    sessionStorage.removeItem("bookscore-answers");
    sessionStorage.removeItem("bookscore-result");
    sessionStorage.removeItem("bookscore-warning");
    sessionStorage.removeItem("bookscore-demo-mode");
    router.push("/setup");
  }

  async function submitFeedback() {
    if (!quiz || !result || !rating) return;

    setFeedbackStatus("saving");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: quiz.sessionId,
          userName: quiz.userName,
          bookName: quiz.bookName,
          score: result.score,
          rating,
          comment
        })
      });

      if (!response.ok) {
        throw new Error("Feedback request failed.");
      }

      setFeedbackStatus("saved");
    } catch {
      setFeedbackStatus("error");
    }
  }

  if (!quiz || !result) {
    return (
      <StepFrame eyebrow="Results" title="Preparing your scorecard...">
        <div className="h-2 w-full overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
          <div className="h-full w-1/2 animate-pulse rounded-lg bg-rust" />
        </div>
      </StepFrame>
    );
  }

  return (
    <StepFrame eyebrow={`${quiz.bookName} results`} title={`${quiz.userName}, your BookScore is ${result.score}.`}>
      <section className="grid gap-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-soft dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-[220px_1fr] sm:p-8">
        <div className="grid place-items-center rounded-lg bg-paper p-6 dark:bg-zinc-950">
          <div className="text-center">
            <div className="mx-auto grid h-32 w-32 place-items-center rounded-lg bg-ink text-5xl font-bold text-white dark:bg-zinc-100 dark:text-zinc-950">
              {result.score}
            </div>
            <p className="mt-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">{result.percentage}% conceptual retention</p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Personalized feedback</h2>
          <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-300">{result.feedback}</p>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <ResultList title="Strengths" items={result.strengths} />
        <ResultList title="Weak concepts" items={result.weakConcepts} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ResultList title="Chapters or sections to re-read" items={result.chapterSuggestions ?? result.rereadSuggestions} />
        <ResultList title="Topics to revisit" items={result.rereadSuggestions} />
      </div>

      <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Was this useful?</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Rate the result from 1 to 10. A short suggestion is welcome.</p>
          </div>
          {feedbackStatus === "saved" ? (
            <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">Thanks for the feedback.</span>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-10">
          {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`focus-ring min-h-10 rounded-lg border text-sm font-semibold transition ${
                rating === value
                  ? "border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 bg-paper text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
              }`}
              aria-pressed={rating === value}
            >
              {value}
            </button>
          ))}
        </div>

        <label className="mt-5 grid gap-2">
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Suggestion or feedback</span>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="What felt useful, confusing, or missing?"
            rows={4}
            className="focus-ring resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-base outline-none transition dark:border-zinc-800 dark:bg-zinc-950"
          />
        </label>

        {feedbackStatus === "error" ? (
          <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">Feedback could not be saved. Please try once more.</p>
        ) : null}

        <PrimaryButton
          type="button"
          onClick={submitFeedback}
          loading={feedbackStatus === "saving"}
          disabled={!rating || feedbackStatus === "saved"}
          className="mt-5 w-full sm:w-fit"
        >
          {feedbackStatus === "saved" ? "Feedback Sent" : "Submit Feedback"}
        </PrimaryButton>
      </section>

      <div className="flex flex-wrap gap-3">
        <PrimaryButton onClick={retakeQuiz}>
          <RotateCcw size={18} />
          Retake Quiz
        </PrimaryButton>
        <Link
          href="/"
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-sage px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-sage/90"
        >
          Home
          <ArrowRight size={18} />
        </Link>
      </div>
    </StepFrame>
  );
}

function ResultList({ title, items }: { title: string; items: unknown[] }) {
  const normalizedItems = items.map(formatResultItem);

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-4 grid gap-3">
        {normalizedItems.map((item) => (
          <li key={item} className="rounded-lg bg-paper px-4 py-3 leading-6 text-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function formatResultItem(item: unknown) {
  if (typeof item === "string") return item;
  if (typeof item === "number") return String(item);

  if (item && typeof item === "object") {
    const record = item as Record<string, unknown>;
    const chapter = record.chapter || record.chapterHint || record.section || record.topic || "Suggested reread";
    const reason = record.reason || record.explanation || record.why;

    if (typeof reason === "string") {
      return `${String(chapter)}: ${reason}`;
    }

    return Object.entries(record)
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join("; ");
  }

  return String(item);
}
