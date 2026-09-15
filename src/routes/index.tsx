import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/landing/Reveal";
import {
  ArrowRight,
  AudioLines,
  Bookmark,
  Briefcase,
  Download,
  Globe2,
  Headphones,
  ListMusic,
  Play,
  Plane,
  Sparkles,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Airwave — Your music, one browser tab away" },
      {
        name: "description",
        content:
          "Airwave is the zero-install music player that runs in your browser. Millions of songs, podcasts and audiobooks, free to start — no download, no waiting.",
      },
      { property: "og:title", content: "Airwave — Your music, one browser tab away" },
      {
        property: "og:description",
        content:
          "Press play in seconds. Millions of songs, podcasts and audiobooks streaming straight from your browser. Free to start.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const personas = [
  {
    icon: Briefcase,
    role: "The locked-down desk worker",
    frustration: "Can't install apps on a managed work laptop, so music stops at the office door.",
    outcome: "Opens a tab and has a focus mix running before the first meeting starts.",
  },
  {
    icon: Plane,
    role: "The always-borrowing traveller",
    frustration: "Hotel PCs, family laptops, airport kiosks — signing in means installing all over again.",
    outcome: "Logs in anywhere and finds the same library, queue and place in the episode.",
  },
  {
    icon: Headphones,
    role: "The playlist perfectionist",
    frustration: "Bouncing between a clunky desktop app and a phone just to audition one track.",
    outcome: "Builds, reorders and shares a full set in one window, then sends a single link.",
  },
];

const features = [
  {
    icon: Zap,
    name: "Instant play",
    benefit: "Sound in under three seconds — nothing to download, update or restart.",
  },
  {
    icon: Globe2,
    name: "Any device, any browser",
    benefit: "Your library follows you onto every screen you happen to be sitting at.",
  },
  {
    icon: Sparkles,
    name: "Mixes that learn you",
    benefit: "A fresh set that already sounds like your taste, without you building it.",
  },
  {
    icon: ListMusic,
    name: "One shelf for everything",
    benefit: "Songs, podcasts and audiobooks resume exactly where you stopped.",
  },
  {
    icon: Download,
    name: "Save for the dead zones",
    benefit: "Keep albums on hand so the tunnel, the flight and the basement stay loud.",
  },
];

const faqs = [
  {
    q: "Do I need to install anything?",
    a: "No. Airwave runs entirely in your browser. Open the page, sign in and press play — there is nothing to download and nothing to keep updated.",
  },
  {
    q: "Is it really free to start?",
    a: "Yes. You can create an account and start listening for free with occasional ads. A paid plan removes ads and adds lossless audio and offline saves.",
  },
  {
    q: "Which browsers work?",
    a: "The current and previous versions of Chrome, Safari, Firefox and Edge, on both desktop and mobile.",
  },
  {
    q: "Can I sign in with Google or Apple?",
    a: "You can. One tap with Google or Apple creates your account with no password to invent or remember.",
  },
  {
    q: "What if I forget my password?",
    a: "Use the reset link on the sign-in screen and you'll get an email to set a new one in under a minute.",
  },
  {
    q: "How good does it sound?",
    a: "High-quality streaming by default, with a lossless setting on paid plans where the recording allows it.",
  },
  {
    q: "Will it work on a slow connection?",
    a: "Airwave measures your connection and buffers ahead, dropping quality briefly rather than stopping the music.",
  },
  {
    q: "Can I listen offline?",
    a: "On a paid plan you can save albums and playlists to the browser on that device and play them with no connection.",
  },
  {
    q: "Do my playlists move between devices?",
    a: "Everything — saved tracks, playlists, queue and playback position — lives with your account, not the device.",
  },
  {
    q: "Can I use it on a work computer?",
    a: "That's what it's built for. Because there's no software to install, locked-down machines are no obstacle.",
  },
  {
    q: "Is my listening data private?",
    a: "Your history is yours. You choose what gets shared to your public profile, and we never sell personal data.",
  },
  {
    q: "How do I cancel a paid plan?",
    a: "One click in account settings. You keep access until the end of the period you already paid for.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
              <AudioLines className="size-5" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Airwave</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#audience" className="transition-colors hover:text-foreground">
              Who it's for
            </a>
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#start"
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </a>
            <a
              href="#start"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-100"
            >
              Sign up free
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="ambient-bloom overflow-hidden">
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:py-24">
          <Reveal className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              No download. No install. Just a tab.
            </span>
            <h1 className="mt-6 max-w-[19ch] text-balance font-display text-5xl font-bold leading-[1.02] sm:text-6xl">
              Your music shouldn't need an <span className="text-gradient-signal">install</span>.
            </h1>
            <p className="mt-6 max-w-[46ch] text-pretty text-lg leading-relaxed text-muted-foreground">
              Millions of songs, podcasts and audiobooks that play the moment you open a tab — on any
              computer you happen to be sitting at.
            </p>
            <div id="start" className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#start"
                className="rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-100"
              >
                Start listening free
              </a>
              <a
                href="#features"
                className="group flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
              >
                See how it works
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Free forever tier · No card required · Sign in with Google or Apple
            </p>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="surface-panel glow-ring rounded-3xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Now playing
                  </p>
                  <p className="mt-1.5 font-display text-xl font-semibold">Late Signal</p>
                  <p className="text-sm text-muted-foreground">Kaya Mora · Night Rooms</p>
                </div>
                <span className="grid size-11 place-items-center rounded-xl bg-accent/15 text-accent">
                  <Bookmark className="size-5" />
                </span>
              </div>

              <div className="my-6 flex h-14 items-end gap-1">
                {[42, 78, 55, 94, 63, 45, 82, 50, 88, 60, 36, 72, 52, 90, 47, 68, 40, 84, 58, 74].map(
                  (h, i) => (
                    <span
                      key={i}
                      className={`eq-bar w-full rounded-full ${i % 5 === 4 ? "bg-accent/80" : "bg-primary/70"}`}
                      style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
                    />
                  ),
                )}
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label="Play"
                  className="grid size-14 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
                >
                  <Play className="size-6 fill-current" />
                </button>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1:24</span>
                    <span>3:48</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-1/3 rounded-full bg-primary" />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5 text-center">
                <div>
                  <p className="font-display text-xl font-bold text-primary">100M+</p>
                  <p className="mt-1 text-xs text-muted-foreground">Tracks</p>
                </div>
                <div>
                  <p className="font-display text-xl font-bold">0</p>
                  <p className="mt-1 text-xs text-muted-foreground">Downloads</p>
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-accent">3s</p>
                  <p className="mt-1 text-xs text-muted-foreground">To first note</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* AUDIENCE */}
      <section id="audience" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <Reveal className="max-w-[42ch]">
          <p className="text-sm font-semibold text-primary">Who it's for</p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold sm:text-4xl">
            Built for people who can't install anything.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {personas.map((p, i) => (
            <Reveal
              key={p.role}
              delay={i * 90}
              as="article"
              className="surface-panel rounded-2xl p-6"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-primary/12 text-primary">
                <p.icon className="size-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">{p.role}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground/80">Frustration: </span>
                {p.frustration}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground/80">What they get: </span>
                {p.outcome}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <Reveal className="max-w-[42ch]">
          <p className="text-sm font-semibold text-primary">What you get</p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold sm:text-4xl">
            Everything the app did. None of the waiting.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal
              key={f.name}
              delay={i * 70}
              as="article"
              className={`surface-panel flex flex-col rounded-2xl p-6 ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <span className="grid size-10 place-items-center rounded-lg bg-accent/12 text-accent">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.benefit}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="surface-panel relative overflow-hidden rounded-3xl px-6 py-14 sm:px-12">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-[90px]" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="max-w-[22ch] text-balance font-display text-3xl font-bold sm:text-4xl">
                Press play in the next thirty seconds.
              </h2>
              <p className="mt-3 max-w-[44ch] text-pretty text-muted-foreground">
                Free to start, no card, no install. Open the tab and the music is already there.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <a
                href="#start"
                className="rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-100"
              >
                Start listening free
              </a>
              <a
                href="#faq"
                className="rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
              >
                Learn more
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <Reveal>
          <p className="text-sm font-semibold text-primary">FAQ</p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold sm:text-4xl">
            Questions, answered.
          </h2>
        </Reveal>
        <Reveal delay={90} className="mt-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="text-left font-display text-base font-semibold hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      <footer className="border-t border-border bg-surface/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[34ch]">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
                <AudioLines className="size-5" />
              </span>
              <span className="font-display text-lg font-semibold">Airwave</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              The browser music player that starts playing before you finish sitting down.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="#faq" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              Terms
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              Cookies
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              Support
            </a>
          </div>
          <label className="text-sm text-muted-foreground">
            <span className="mb-2 block">Region &amp; language</span>
            <select className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
              <option>English (US)</option>
              <option>Português (BR)</option>
              <option>Español</option>
              <option>Français</option>
            </select>
          </label>
        </div>
        <div className="mx-auto max-w-6xl border-t border-border px-5 py-6 text-xs text-muted-foreground sm:px-8">
          © 2026 Airwave Audio, Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
