import type { ReactNode } from "react";
import { AppShell } from "./AppShell";

export function StepFrame({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <AppShell>
      <section className="mx-auto grid w-full max-w-4xl gap-8 px-5 pb-16 pt-8 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rust dark:text-orange-300">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-ink dark:text-white sm:text-5xl">{title}</h1>
        </div>
        {children}
      </section>
    </AppShell>
  );
}
