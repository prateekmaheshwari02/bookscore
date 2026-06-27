"use client";

import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StepFrame } from "@/components/StepFrame";
import type { QuizPayload, UserAnswer } from "@/lib/types";

export default function QuizPage() {
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizPayload | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedQuiz = sessionStorage.getItem("bookscore-quiz");
    if (!savedQuiz) {
      router.replace("/");
      return;
    }

    setQuiz(JSON.parse(savedQuiz) as QuizPayload);
  }, [router]);

  const completedCount = useMemo(() => Object.keys(selectedAnswers).length, [selectedAnswers]);
  const progress = quiz ? Math.round((completedCount / quiz.questions.length) * 100) : 0;

  async function submitQuiz() {
    if (!quiz) return;

    if (completedCount !== quiz.questions.length) {
      setError("Please answer every question before submitting.");
      return;
    }

    setError("");
    setLoading(true);

    const answers: UserAnswer[] = quiz.questions.map((question, index) => ({
      question: question.question,
      selectedAnswer: selectedAnswers[index],
      correctAnswer: question.correctAnswer,
      concept: question.concept,
      chapterHint: question.chapterHint
    }));

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: quiz.userName,
          bookName: quiz.bookName,
          answers
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Could not evaluate your quiz.");
      }

      sessionStorage.setItem("bookscore-answers", JSON.stringify(answers));
      sessionStorage.setItem("bookscore-result", JSON.stringify(payload));
      router.push("/results");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not evaluate your quiz.");
    } finally {
      setLoading(false);
    }
  }

  if (!quiz) {
    return (
      <StepFrame eyebrow="Quiz" title="Loading your questions...">
        <div className="h-2 w-full overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
          <div className="h-full w-1/2 animate-pulse rounded-lg bg-rust" />
        </div>
      </StepFrame>
    );
  }

  return (
    <StepFrame eyebrow={`${quiz.bookName} quiz`} title={`Answer thoughtfully, ${quiz.userName}.`}>
      <div className="sticky top-0 z-10 -mx-5 border-y border-zinc-200 bg-paper/90 px-5 py-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 sm:-mx-8 sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <Link href="/" className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900" aria-label="Back to home">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <div className="mb-2 flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
              <span>{completedCount} of {quiz.questions.length} answered</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
              <div className="h-full rounded-lg bg-sage transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5">
        {quiz.questions.map((question, questionIndex) => (
          <section key={question.question} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex gap-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-paper text-sm font-bold text-rust dark:bg-zinc-950 dark:text-orange-300">{questionIndex + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold leading-7">{question.question}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {question.options.map((option) => {
                const checked = selectedAnswers[questionIndex] === option;

                return (
                  <label
                    key={option}
                    className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                      checked
                        ? "border-sage bg-sage/10 text-ink dark:text-white"
                        : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      value={option}
                      checked={checked}
                      onChange={() => setSelectedAnswers((answers) => ({ ...answers, [questionIndex]: option }))}
                      className="h-4 w-4 accent-sage"
                    />
                    <span className="flex-1">{option}</span>
                    {checked ? <CheckCircle2 size={18} className="text-sage" /> : null}
                  </label>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</p> : null}

      <PrimaryButton onClick={submitQuiz} loading={loading} className="w-full sm:w-fit">
        {loading ? "Evaluating" : "Submit Quiz"}
      </PrimaryButton>
    </StepFrame>
  );
}
