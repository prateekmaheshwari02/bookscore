"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StepFrame } from "@/components/StepFrame";
import type { QuizPayload } from "@/lib/types";

export default function SetupPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [bookName, setBookName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
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

        <PrimaryButton type="submit" loading={loading} className="w-full sm:w-fit">
          {loading ? "Generating Quiz" : "Generate Quiz"}
        </PrimaryButton>
      </form>
    </StepFrame>
  );
}
