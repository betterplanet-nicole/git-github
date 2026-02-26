"use client";

import Link from "next/link";
import { useState } from "react";
import content from "@/content/utility.json";
import { UtilityContent } from "@/lib/types";

const data = content as UtilityContent;

const iconShapes = ["⚡", "💬", "🛰️", "🧾", "📈", "🔔"];

export const UtilityLanding = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="text-lg font-semibold text-brand-900">UtilityOps AI</div>
          <button
            aria-label="Toggle navigation menu"
            className="rounded-md border border-slate-300 p-2 md:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            ☰
          </button>
          <nav className="hidden items-center gap-6 md:flex">
            {data.nav.map((item) => (
              <a className="text-sm font-medium text-slate-700" href="#" key={item}>
                {item}
              </a>
            ))}
            <Link
              className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              href="/demo"
            >
              Book a Demo
            </Link>
          </nav>
        </div>
        {open ? (
          <div className="space-y-2 border-t border-slate-200 px-4 py-3 md:hidden">
            {data.nav.map((item) => (
              <a className="block text-sm text-slate-700" href="#" key={item}>
                {item}
              </a>
            ))}
            <Link className="block rounded-md bg-brand-500 px-3 py-2 text-white" href="/demo">
              Book a Demo
            </Link>
          </div>
        ) : null}
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-700">Utilities use case</p>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">{data.hero.headline}</h1>
            <p className="mt-4 text-lg text-slate-600">{data.hero.subheadline}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="rounded-full bg-brand-500 px-5 py-3 font-semibold text-white" href="/demo">
                {data.hero.primaryCta}
              </Link>
              <a className="rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700" href="#learn-more">
                {data.hero.secondaryCta}
              </a>
            </div>
          </div>
          <div className="gradient-card rounded-3xl p-6 text-white shadow-2xl">
            <div className="rounded-2xl bg-white/10 p-6">
              <p className="text-sm uppercase tracking-wide text-sky-100">Live operations preview</p>
              <div className="mt-4 space-y-3">
                <div className="h-3 w-full rounded bg-white/25" />
                <div className="h-3 w-4/5 rounded bg-white/25" />
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div className="h-7 rounded bg-white/20" key={`hero-grid-${i}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-14" id="learn-more">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold">Are You Driving Utility Innovation or Operations?</h2>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {data.personas.map((persona) => (
                <li className="rounded-xl border border-slate-200 bg-slate-50 p-4" key={persona}>
                  {persona}
                </li>
              ))}
            </ul>
            <Link className="mt-6 inline-block rounded-full bg-brand-500 px-5 py-3 font-semibold text-white" href="/demo">
              Explore the Demo Console
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-bold">Fixing What Slows Utilities Down</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {data.painPoints.map((pain) => (
              <p className="rounded-lg border-l-4 border-brand-500 bg-white p-4 shadow-sm" key={pain}>
                {pain}
              </p>
            ))}
          </div>
        </section>

        <section className="bg-slate-100 py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold">How the Product Helps You Run Smarter</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.features.map((feature, index) => (
                <article className="rounded-2xl bg-white p-5 shadow-sm" key={feature.title}>
                  <div className="text-2xl" role="img" aria-label={`${feature.title} icon`}>
                    {iconShapes[index % iconShapes.length]}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-bold">AI-Powered Utility Ops in 4 Steps</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {data.steps.map((step, i) => (
              <li className="rounded-xl border border-slate-200 bg-white p-4" key={step}>
                <p className="text-sm font-semibold text-brand-700">Step {i + 1}</p>
                <p className="mt-2 font-medium">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-white py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold">Real-World Outputs</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {data.outputs.map((output) => (
                <article className="rounded-2xl border border-slate-200 p-5" key={output.title}>
                  <h3 className="text-xl font-semibold">{output.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{output.description}</p>
                  <Link className="mt-4 inline-block font-semibold text-brand-700" href="/demo">
                    Schedule a demo →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-900 py-14 text-white">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold">Real Results. Real Impact.</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {data.stats.map((stat) => (
                <article className="rounded-xl border border-slate-700 bg-slate-800 p-5" key={stat.label}>
                  <p className="text-3xl font-bold text-sky-300">{stat.value}</p>
                  <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} UtilityOps AI</p>
          <div className="flex gap-3 text-slate-500" aria-label="social links">
            <span>𝕏</span>
            <span>in</span>
            <span>▶</span>
          </div>
          <div className="flex gap-4">
            {data.footerLinks.map((link) => (
              <a className="text-sm text-slate-600" href="#" key={link}>
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
