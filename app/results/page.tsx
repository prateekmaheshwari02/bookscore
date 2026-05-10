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
  const [demoMode, setDemoMode] = useState(false);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    const savedQuiz = sessionStorage.getItem("bookscore-quiz");
    const savedResult = sessionStorage.getItem("bookscore-result");

    if (!savedQuiz || !savedResult) {
      router.replace("/setup");
      return;
    }

    setQuiz(JSON.parse(savedQuiz) as QuizPayload);
    setResult(JSON.parse(savedResult) as EvaluationResult);
    setDemoMode(sessionStorage.getItem("bookscore-demo-mode") === "true");
    setWarning(sessionStorage.getItem("bookscore-warning") || "");
  }, [router]);

  function retakeQuiz() {
    sessionStorage.removeItem("bookscore-quiz");
    sessionStorage.removeItem("bookscore-answers");
    sessionStorage.removeItem("bookscore-result");
    sessionStorage.removeItem("bookscore-warning");
    sessionStorage.removeItem("bookscore-demo-mode");
    router.push("/setup");
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

      {demoMode ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          {warning || "Demo mode result: add a real OpenAI API key later to generate book-specific questions and feedback."}
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <ResultList title="Strengths" items={result.strengths} />
        <ResultList title="Weak concepts" items={result.weakConcepts} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ResultList title="Chapters or sections to re-read" items={result.chapterSuggestions ?? result.rereadSuggestions} />
        <ResultList title="Topics to revisit" items={result.rereadSuggestions} />
      </div>

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
