"use client";
import React from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import {
  Copy,
  Check,
  Play,
  Rocket,
  Settings2,
  ShieldCheck,
  ToggleRightIcon,
  BookOpen,
  Database,
  Wrench,
  Plus,
} from "lucide-react";

/*
  Interactive documentation page for your FeatureFlag app.
  - Place this file at: app/docs/page.tsx (App Router) or pages/docs.tsx (Pages Router)
  - Requires TailwindCSS and react-hot-toast installed.

  What you'll get:
  • Hero + feature overview
  • Quickstart with copyable commands
  • API Explorer (live):
      - Get project details & flags (using apiKey + projectId)
      - Create project
      - Create / Update / Delete flags
    Note: Endpoints assume your backend from earlier messages.
    Adjust paths if your server differs.
*/

// ---------- helpers ----------
const cls = (...xs: (string | false | undefined)[]) =>
  xs.filter(Boolean).join(" ");

function CodeBlock({
  code,
  language = "bash",
  onCopy,
}: {
  code: string;
  language?: string;
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
    <div className="relative group">
      <pre className="rounded-xl border border-gray-200 bg-gray-50 p-2 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 shadow-sm hover:bg-gray-50"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" /> Copied
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" /> Copy
          </>
        )}
      </button>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white/70 backdrop-blur border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

// ---------- API Explorer ----------
export default function DocsPage() {
  const [apiBase, setApiBase] = React.useState<string>(
    process.env.NEXT_PUBLIC_API_URL || ""
  );
  const [apiKey, setApiKey] = React.useState<string>("");

  // Common axios client (cookies included for auth'd endpoints)
  const api = React.useMemo(
    () =>
      axios.create({
        baseURL: apiBase || undefined,
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }),
    [apiBase]
  );

  // Explorer state
  const [projectId, setProjectId] = React.useState("");
  const [projectName, setProjectName] = React.useState("");
  const [projectDesc, setProjectDesc] = React.useState("");
  const [flagId, setFlagId] = React.useState("");
  const [flagName, setFlagName] = React.useState("");
  const [flagDesc, setFlagDesc] = React.useState("");
  const [flagEnv, setFlagEnv] = React.useState("development");
  const [flagEnabled, setFlagEnabled] = React.useState(true);
  const [result, setResult] = React.useState<any>(null);
  const [busy, setBusy] = React.useState(false);

  const stringify = (x: any) => JSON.stringify(x, null, 2);

  // ---- actions ----
  const callWithToast = async (
    fn: () => Promise<any>,
    loadingMsg = "Calling API..."
  ) => {
    const id = toast.loading(loadingMsg, { id: "api-docs-call" });
    setBusy(true);
    try {
      const res = await fn();
      setResult(res?.data);
      toast.success("Done", { id });
    } catch (err: any) {
      setResult({ error: err?.response?.data ?? err?.message ?? String(err) });
      toast.error(
        err?.response?.data?.message || err?.message || "Request failed",
        { id }
      );
    } finally {
      setBusy(false);
    }
  };

  // Endpoints used here (adjust if your backend differs)
  const getProjectDetails = () =>
    callWithToast(
      () => api.get(`/projects/getProjectDetails/${apiKey}/${projectId}`),
      "Fetching project & flags..."
    );
  const createProject = () =>
    callWithToast(
      () =>
        api.post(`/projects/createProject`, {
          name: projectName,
          description: projectDesc,
        }),
      "Creating project..."
    );
  const createFlag = () =>
    callWithToast(
      () =>
        api.post(`/flags/createFlag/${projectId}`, {
          name: flagName,
          description: flagDesc,
          environment: flagEnv,
          isEnabled: flagEnabled.toString(),
        }),
      "Creating flag..."
    );
  const updateFlag = () =>
    callWithToast(
      () =>
        api.patch(`/flags/updateFlag`, {
          flagId,
          name: flagName || undefined,
          description: flagDesc || undefined,
          environment: flagEnv || undefined,
          isEnabled: flagEnabled.toString(),
        }),
      "Updating flag..."
    );
  const deleteFlag = () =>
    callWithToast(
      () => api.delete(`/flags/deleteFlag/${flagId}`),
      "Deleting flag..."
    );

  // Render
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full border border-blue-200 mb-2">
                <Rocket className="w-3.5 h-3.5" />
                FeatureFlag Docs
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Ship confidently with runtime flags
              </h1>
              <p className="text-gray-700 mt-2 max-w-2xl">
                Create projects, add flags, flip them instantly, and query their
                values via a simple API. This page doubles as interactive
                documentation—try the API Explorer below.
              </p>
              <div className="mt-4 flex gap-2">
                <a
                  href="#explorer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
                >
                  <Play className="w-4 h-4" /> Open API Explorer
                </a>
                <a
                  href="#quickstart"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50"
                >
                  <BookOpen className="w-4 h-4" /> Quickstart
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-sm text-gray-600">Toggle on the go</div>
                <div className="mt-2 text-gray-900 font-semibold flex items-center gap-2">
                  <ToggleRightIcon className="w-4 h-4" /> Enable / Disable
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-sm text-gray-600">Multi-env</div>
                <div className="mt-2 text-gray-900 font-semibold">
                  dev • staging • prod
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-sm text-gray-600">API-first</div>
                <div className="mt-2 text-gray-900 font-semibold flex items-center gap-2">
                  <Database className="w-4 h-4" /> Fetch by project
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-sm text-gray-600">Secure</div>
                <div className="mt-2 text-gray-900 font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Cookies + API key
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Quickstart & Features */}
        <div className="lg:col-span-1 space-y-6">
          <Section
            title="Quickstart"
            icon={<BookOpen className="w-5 h-5 text-blue-700" />}
          >
            <ol className="list-decimal list-inside text-sm text-gray-800 space-y-2">
              <li>Login in the app, then go to the Dashboard.</li>
              <li>
                Create a <b>Project</b> and note its <b>projectId</b>.
              </li>
              <li>
                Create <b>Flags</b> inside that project.
              </li>
              <li>
                Query flags using your <b>API key</b> and <b>projectId</b>.
              </li>
            </ol>
            <div className="mt-4">
              <CodeBlock
                code={`# Example curl (no cookies required if your endpoint uses apiKey path)
curl -s "${
                  apiBase || "http://localhost:8080/api"
                }/projects/getProjectDetails/<API_KEY>/<PROJECT_ID>" | jq
`}
                onCopy={() => toast.success("Copied curl")}
              />
            </div>
          </Section>

          <Section
            title="Features"
            icon={<Settings2 className="w-5 h-5 text-blue-700" />}
          >
            <ul className="text-sm text-gray-800 space-y-2">
              <li>• Create projects and manage them from a single dashboard</li>
              <li>
                • Add flags with <i>name</i>, <i>description</i>,{" "}
                <i>environment</i>, and <i>enabled</i> state
              </li>
              <li>• Toggle flags instantly; values update in real time</li>
              <li>• Update or delete flags anytime</li>
              <li>
                • Fetch all flags for a project via API (by API key + projectId)
              </li>
            </ul>
          </Section>

          <Section
            title="Security"
            icon={<ShieldCheck className="w-5 h-5 text-blue-700" />}
          >
            <p className="text-sm text-gray-800">
              User-authenticated endpoints use HttpOnly cookies. Public
              integration uses an <b>API key</b> (per user) passed as a path
              param for read operations. Always store secrets in server-side
              environments.
            </p>
          </Section>
        </div>

        {/* Right column: API Explorer */}
        <div id="explorer" className="lg:col-span-2 space-y-6">
          <Section
            title="API Explorer"
            icon={<Wrench className="w-5 h-5 text-blue-700" />}
          >
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">API Base URL</label>
                <input
                  value={apiBase}
                  onChange={(e) => setApiBase(e.target.value)}
                  placeholder="http://localhost:8080/api"
                  className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">
                  API Key (from your user)
                </label>
                <input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="YOUR_API_KEY"
                  className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Get project details */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-gray-700" />
                <h3 className="font-semibold">GET project details + flags</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600">Project ID</label>
                  <input
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    placeholder="PROJECT_ID"
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={getProjectDetails}
                    disabled={!apiBase || !apiKey || !projectId}
                    className={cls(
                      "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold",
                      !apiBase || !apiKey || !projectId
                        ? "bg-gray-200 text-gray-500"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    <Play className="w-4 h-4" /> Call endpoint
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <CodeBlock
                  code={`GET ${
                    apiBase || "http://localhost:8080/api"
                  }/projects/getProjectDetails/${apiKey || "<API_KEY>"}/${
                    projectId || "<PROJECT_ID>"
                  }`}
                  onCopy={() => toast.success("Copied path")}
                />
              </div>
            </div>

            {/* Create project */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="w-4 h-4 text-gray-700" />
                <h3 className="font-semibold">POST create project</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600">Name</label>
                  <input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="My Project"
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Description</label>
                  <input
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    placeholder="What it does"
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="mt-2 flex overflow-x-scroll items-center gap-2">
                <button
                  onClick={createProject}
                  disabled={!apiBase || !projectName || !projectDesc}
                  className={cls(
                    "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold",
                    !apiBase || !projectName || !projectDesc
                      ? "bg-gray-200 text-gray-500"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  <Play className="w-4 h-4" /> Create
                </button>
                <CodeBlock
                  code={`curl -X POST \ \
  "${apiBase || "http://localhost:8080/api"}/projects/createProject" \
  -H "Content-Type: application/json" \
  --cookie "accessToken=<YOUR_HTTPONLY_COOKIE>" \
  -d '{"name":"${projectName || "My Project"}","description":"${
                    projectDesc || "What it does"
                  }"}'`}
                />
              </div>
            </div>

            {/* Create / Update / Delete flag */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 mb-2">
                <ToggleRightIcon className="w-4 h-4 text-gray-700" />
                <h3 className="font-semibold">
                  Flags (create / update / delete)
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600">
                    Project ID (for create)
                  </label>
                  <input
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    placeholder="PROJECT_ID"
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">
                    Flag ID (for update/delete)
                  </label>
                  <input
                    value={flagId}
                    onChange={(e) => setFlagId(e.target.value)}
                    placeholder="FLAG_ID"
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="text-xs text-gray-600">Flag name</label>
                  <input
                    value={flagName}
                    onChange={(e) => setFlagName(e.target.value)}
                    placeholder="my-new-flag"
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Environment</label>
                  <select
                    value={flagEnv}
                    onChange={(e) => setFlagEnv(e.target.value)}
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="development">development</option>
                    <option value="staging">staging</option>
                    <option value="production">production</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-700 mt-5">
                  <input
                    type="checkbox"
                    checked={flagEnabled}
                    onChange={(e) => setFlagEnabled(e.target.checked)}
                  />
                  Enabled
                </label>
              </div>
              <div className="mt-3 grid md:grid-cols-3 gap-2">
                <button
                  onClick={createFlag}
                  disabled={!apiBase || !projectId || !flagName}
                  className={cls(
                    "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold",
                    !apiBase || !projectId || !flagName
                      ? "bg-gray-200 text-gray-500"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  <Play className="w-4 h-4" /> Create Flag
                </button>
                <button
                  onClick={updateFlag}
                  disabled={!apiBase || !flagId}
                  className={cls(
                    "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold",
                    !apiBase || !flagId
                      ? "bg-gray-200 text-gray-500"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  <Play className="w-4 h-4" /> Update Flag
                </button>
                <button
                  onClick={deleteFlag}
                  disabled={!apiBase || !flagId}
                  className={cls(
                    "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold",
                    !apiBase || !flagId
                      ? "bg-gray-200 text-gray-500"
                      : "bg-red-600 text-white hover:bg-red-700"
                  )}
                >
                  <Play className="w-4 h-4" /> Delete Flag
                </button>
              </div>
            </div>

            {/* Result */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Response</h3>
                {busy ? (
                  <span className="text-xs text-gray-600">Loading…</span>
                ) : null}
              </div>
              <pre className="mt-2 text-sm bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-x-auto">
                <code>
                  {result ? stringify(result) : "<call an endpoint above>"}
                </code>
              </pre>
            </div>
          </Section>

          {/* Reference */}
          <Section
            title="HTTP Reference"
            icon={<BookOpen className="w-5 h-5 text-blue-700" />}
          >
            <div className="text-sm text-gray-800 space-y-4">
              <div>
                <div className="font-semibold">
                  GET /projects/getProjectDetails/:apiKey/:projectId
                </div>
                <div className="text-gray-700">
                  Returns project details with flags. Use this from servers or
                  public clients.
                </div>
              </div>
              <div>
                <div className="font-semibold">
                  POST /projects/createProject
                </div>
                <div className="text-gray-700">
                  Create project (requires user auth cookie).
                </div>
              </div>
              <div>
                <div className="font-semibold">
                  POST /flags/createFlag/:projectId
                </div>
                <div className="text-gray-700">
                  Create flag inside a project (auth cookie).
                </div>
              </div>
              <div>
                <div className="font-semibold">PATCH /flags/updateFlag</div>
                <div className="text-gray-700">
                  Body:{" "}
                  {"{ flagId, name?, description?, environment?, isEnabled? }"}{" "}
                  (auth cookie).
                </div>
              </div>
              <div>
                <div className="font-semibold">
                  DELETE /flags/deleteFlag/:flagId
                </div>
                <div className="text-gray-700">
                  Delete a flag (auth cookie).
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
