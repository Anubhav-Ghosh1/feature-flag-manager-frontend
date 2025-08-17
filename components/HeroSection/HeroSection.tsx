// import React from "react";
// import Footer from "../Footer/Footer";
// import { useRouter } from "next/navigation";

// export default function HeroSection() {
//   let router = useRouter();
//   let buttonStyle =
//     "px-3 py-2 text-lg text-white font-medium rounded-sm transition-all ease-in duration-200";
//   let cardData = [
//     {
//       id: 1,
//       title: "What's a Feature Flag?",
//       description:
//         "Feature flags are a software development technique that allows teams to enable, disable or change the behavior of certain features or code paths in a product or service, without modifying the source code.",
//     },
//     {
//       id: 2,
//       title: "Why use Feature Manager?",
//       description:
//         "Feature Manager provides a centralized way to manage feature flags, making it easier for teams to control the rollout of new features and gather feedback.",
//     },
//   ];
//   return (
//     <div>
//       <div className="flex flex-col items-center justify-between p-24 gap-9">
//         <div className="flex flex-col items-center gap-3">
//           <p className="text-3xl font-bold cursor-default text-gray-900">
//             Feature Manager
//           </p>
//           <p className="text-lg cursor-default text-gray-600">
//             Allowing people to manage feature flags with ease
//           </p>
//         </div>
//         <div className="flex items-center gap-4">
//           <button
//             className={`${buttonStyle} cursor-pointer bg-purple-600 hover:bg-purple-700`}
//           >
//             Learn More
//           </button>
//           <button
//             onClick={() => {
//               router.push("/auth/login");
//             }}
//             className={`${buttonStyle} cursor-pointer bg-gray-700 hover:bg-gray-800`}
//           >
//             Get Started
//           </button>
//         </div>
//         <div className="flex w-full justify-between mt-24 gap-20">
//           {cardData.map((card) => (
//             <div
//               key={card.id}
//               className="flex flex-col items-center gap-2 w-fit"
//             >
//               <p className="text-xl cursor-pointer font-semibold text-gray-900 w-fit">
//                 {card.title}
//               </p>
//               <p className="font-medium cursor-pointer text-gray-500 text-center w-7/10">
//                 {card.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Footer from "../Footer/Footer";
import {
  Flag,
  ToggleLeftIcon,
  Layers,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  BookOpen,
  Play,
  Copy,
  Check,
  ToggleRightIcon,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

export default function HeroSection() {
  const router = useRouter();

  const onLearnMore = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("features");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative overflow-hidden">
      <Toaster position="top-right" />
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-50 via-white to-blue-50" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-gray-900">
              Feature Manager
            </span>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <button
              onClick={() => router.push("/docs")}
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              Docs
            </button>
            <a
              href="#features"
              onClick={onLearnMore}
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              Features
            </a>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push("/auth/login")}
              className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm text-white shadow-sm transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
            >
              Get Started
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="mx-auto max-w-6xl px-6 pt-16 md:pt-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3 py-1 text-xs text-gray-700 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-violet-600" />
          Ship safely with runtime flags
        </div>

        <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
          Feature flags{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            that feel effortless
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-gray-700">
          Create projects, add flags, flip them instantly across environments,
          and query values via a simple API. Faster rollouts, safer experiments,
          zero redeploys.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push("/auth/login")}
            className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2.5 text-white shadow-sm transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
          >
            Get Started
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => router.push("/docs")}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
          >
            View Docs
            <BookOpen className="h-4 w-4" />
          </button>

          <a
            href="#features"
            onClick={onLearnMore}
            className="text-sm font-medium text-gray-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
          >
            Learn more
          </a>
        </div>

        {/* Stats / badges */}
        <div className="mt-8 grid max-w-2xl grid-cols-2 gap-4 text-sm text-gray-700 sm:grid-cols-3">
          <StatCard label="Toggle latency" value="~50ms" />
          <StatCard label="Environments" value="dev • staging • prod" />
          <StatCard label="API-first" value="Fetch flags by project" />
        </div>

        {/* “Screenshot” / Preview card */}
        <PreviewCard />
      </header>

      {/* FEATURES */}
      <section id="features" className="mx-auto mt-16 max-w-6xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FeatureCard
            icon={<Flag className="w-5 h-5 text-violet-600" />}
            title="What’s a Feature Flag?"
            desc="A switch you control at runtime—turn features on/off, target environments, and roll out safely without redeploys."
          />
          <FeatureCard
            icon={<Layers className="w-5 h-5 text-indigo-600" />}
            title="Why Feature Manager?"
            desc="Centralized control, instant toggles, and visibility. Ship faster, experiment safely, and revert in a click."
          />
          <FeatureCard
            icon={<ToggleRightIcon className="w-5 h-5 text-blue-600" />}
            title="Flip on the fly"
            desc="Enable or disable flags in dev, staging, or prod instantly—no waiting on CI/CD pipelines."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
            title="Secure by default"
            desc="HttpOnly cookies for app auth, API key for read endpoints, and environment-scoped controls."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto mb-16 max-w-6xl px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            How it works
          </h2>
          <ol className="mt-4 grid gap-4 text-sm text-gray-800 md:grid-cols-3">
            <Step
              n={1}
              title="Create a project"
              desc="Group related flags. Each project has an ID."
            />
            <Step
              n={2}
              title="Add flags"
              desc="Name, description, env, and enabled state."
            />
            <Step
              n={3}
              title="Query via API"
              desc="Use your API key + projectId to fetch flags."
            />
          </ol>

          <div className="mt-5">
            <CopyableCode
              code={`curl -s "http://localhost:8080/api/projects/getProjectDetails/<API_KEY>/<PROJECT_ID>" | jq`}
              onCopy={() => toast.success("Copied curl")}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ----------------- small components ----------------- */

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white/70 p-3 backdrop-blur">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function LogoBox({ name }: { name: string }) {
  return (
    <div className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white text-xs font-semibold text-gray-600">
      {name}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-gray-50 px-2.5 py-1 text-xs text-gray-700 ring-1 ring-gray-200">
        {icon}
        <span>Feature</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-700">{desc}</p>
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-violet-200/40 opacity-0 blur-2xl transition group-hover:opacity-100" />
    </article>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <li className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
        {n}
      </div>
      <h4 className="mt-2 font-semibold text-gray-900">{title}</h4>
      <p className="text-gray-700">{desc}</p>
    </li>
  );
}

function CopyableCode({
  code,
  onCopy,
}: {
  code: string;
  onCopy?: () => void;
}) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 shadow-sm transition hover:bg-gray-50"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function PreviewCard() {
  return (
    <div className="mt-10 rounded-2xl border border-violet-200/60 bg-gradient-to-br from-white via-white to-violet-50 p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-900">
          Quick flag preview
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
          Live
          <Play className="h-3 w-3" />
        </div>
      </div>

      {/* Faux table preview */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="grid grid-cols-5 border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">
          <div>Name</div>
          <div>Description</div>
          <div>Env</div>
          <div>Enabled</div>
          <div>Actions</div>
        </div>
        {[
          {
            name: "new-pricing",
            desc: "Expose new pricing page",
            env: "staging",
            on: true,
          },
          { name: "beta-ui", desc: "Activate new UI", env: "dev", on: false },
        ].map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-5 items-center px-3 py-2 text-sm text-gray-800 odd:bg-white even:bg-gray-50"
          >
            <div className="font-mono">{r.name}</div>
            <div className="truncate">{r.desc}</div>
            <div className="text-xs text-gray-600">{r.env}</div>
            <div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  r.on ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                }`}
              >
                {r.on ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="text-xs text-gray-600">toggle • edit • delete</div>
          </div>
        ))}
      </div>
    </div>
  );
}
