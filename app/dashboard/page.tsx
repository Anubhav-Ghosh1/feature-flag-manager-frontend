"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation";
import { CopyIcon } from "lucide-react";
import { Trash2 } from "lucide-react";
import { PencilIcon } from "lucide-react";
import { LogOut } from "lucide-react";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../../components/CommonUtils/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

type Project = {
  _id: string;
  name: string;
  description?: string;
  projectId?: string;
  flags: Flag[];
  createdAt?: string;
  updatedAt?: string;
};

type Flag = {
  _id: string;
  name: string;
  description?: string;
  environment?: "development" | "staging" | "production" | string;
  isEnabled?: "true" | "false" | boolean;
};

const handleAxiosError = (err: any) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

const formatDate = (d?: string) => {
  if (!d) return "";
  const date = new Date(d);
  return isNaN(date.getTime()) ? "" : date.toLocaleString();
};

function ToastTrigger({
  message,
  tone = "success",
  onDone,
}: {
  message?: string;
  tone?: "success" | "error";
  onDone?: () => void;
}) {
  React.useEffect(() => {
    if (!message) return;
    (tone === "error" ? toast.error : toast.success)(message);
    onDone?.();
  }, [message, tone, onDone]);
  return null;
}

// ------- Modal (headless) -------
function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[540px] bg-white shadow-2xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl cursor-default font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 cursor-pointer hover:text-gray-800"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CreateProjectPanel({
  onCreated,
}: {
  onCreated: (p: Project) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastInfo, setToast] = useState<{
    text: string;
    tone?: "success" | "error";
  } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/projects/createProject", {
        name,
        description,
      });
      onCreated(res.data.data);
      setName("");
      setDescription("");
      ToastTrigger({ message: "Project Created Successfully" });
    } catch (err: any) {
      ToastTrigger({ message: "Error while creating project", tone: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 2000);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur border border-gray-200 rounded-2xl p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Create Project
      </h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white/70 focus:outline-none focus:ring-1 focus:ring-gray-400"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white/70 focus:outline-none focus:ring-1 focus:ring-gray-400"
          placeholder="Project description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (p: Project) => void;
}) {
  const { user } = useUser();
  return (
    <div
      className="bg-white/70 backdrop-blur border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition cursor-pointer"
      onClick={() => onOpen(project)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1">
            <p className="font-semibold text-gray-900">Project Name: </p>
            <p className="text-gray-700">{project.name}</p>
          </div>
          {project.description && (
            <div className="flex items-center gap-1">
              <p className="font-semibold text-gray-900">Description: </p>
              <p className="text-sm text-gray-700">{project.description}</p>
            </div>
          )}
          {project.projectId && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">Project URL:</span>
              <button
                type="button"
                title="Copy Project URL"
                className="ml-1 p-1 rounded hover:bg-gray-200 cursor-pointer transition"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(
                    `${API_BASE_URL}/projects/getProject/${user.api_key}/${project.projectId}`
                  );
                  toast.success("Project URL copied to clipboard");
                }}
              >
                <CopyIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <div className="mt-3 text-xs text-gray-600 flex gap-3">
          {project.flags && (
            <div className="flex items-center justify-center w-5 h-5 bg-gray-100 border border-gray-200 rounded-full">
              <span className="text-gray-900">{project.flags.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FlagsSection({ projectId }: { projectId: string }) {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [environment, setEnvironment] = useState("development");
  const [enabled, setEnabled] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<Flag | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/projects/getProjectDetails/${projectId}`);
      setFlags(res.data?.data?.flags ?? []);
    } catch (e) {
      setFlags([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [projectId]);

  const addFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(`/flags/createFlag/${projectId}`, {
        name,
        description,
        environment,
        isEnabled: enabled.toString(),
      });
      setFlags((prev) => [...prev, res.data.data]);
      setName("");
      setDescription("");
      setEnvironment("development");
      setEnabled(true);
      ToastTrigger({ message: "Flag created successfully" });
    } catch (err: any) {
      ToastTrigger({ message: err, tone: "error" });
    }
  };

  const openEdit = (flag: Flag) => {
    setEditingFlag(flag);
    setEditOpen(true);
  };

  const onFlagSaved = (updated: Flag) => {
    setFlags((prev) => prev.map((f) => (f._id === updated._id ? updated : f)));
  };

  const toggleFlag = async (flag: Flag) => {
    try {
      const newVal = !(flag.isEnabled === true || flag.isEnabled === "true");
      await api.post(`/flags/toggleFlagState`, {
        flagId: flag._id,
      });
      setFlags((prev) =>
        prev.map((f) => (f._id === flag._id ? { ...f, isEnabled: newVal } : f))
      );
    } catch (err: any) {
      ToastTrigger({ message: "Error while toggling flag state" });
    }
  };

  const deleteFlag = async (flag: Flag) => {
    if (!confirm(`Delete flag "${flag.name}"?`)) return;
    try {
      await api.delete(`/flags/deleteFlag/${flag._id}`);
      setFlags((prev) => prev.filter((f) => f._id !== flag._id));
      ToastTrigger({ message: "Toast deleted successfully" });
    } catch (err: any) {
      ToastTrigger({ message: err, tone: "error" });
    }
  };

  return (
    <div>
      <h4 className="text-sm font-semibold cursor-default text-gray-900 mb-3">
        Flags
      </h4>
      {loading ? (
        <div className="text-sm text-gray-600">Loading flags...</div>
      ) : flags.length === 0 ? (
        <div className="text-sm text-gray-700">No flags yet.</div>
      ) : (
        <ul className="space-y-2 mb-5">
          {flags.map((flag) => (
            <li
              key={flag._id}
              className="border border-gray-200 rounded-lg p-3 bg-white/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-900 font-medium">
                      {flag.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        flag.isEnabled === "true" || flag.isEnabled === true
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {flag.isEnabled === "true" || flag.isEnabled === true
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  </div>
                  {flag.description && (
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-semibold text-gray-800 mt-1">
                        Description:
                      </p>
                      <p className="text-xs text-gray-700 mt-1">
                        {flag.description}
                      </p>
                    </div>
                  )}
                  {flag.environment && (
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-[11px] text-gray-800 font-semibold">
                        Env:
                      </p>
                      <p className="text-[11px] text-gray-700">
                        {flag.environment}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFlag(flag)}
                    className="text-xs px-3 py-1 rounded cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => deleteFlag(flag)}
                    className="text-xs px-3 py-1 rounded cursor-pointer bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    <Trash2 className="w-4 h-4 inline-block" />
                  </button>
                </div>
                <button
                  onClick={() => openEdit(flag)}
                  className="text-xs px-3 py-1 rounded cursor-pointer bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  <PencilIcon className="w-4 h-4 inline-block" />
                </button>
                <EditFlagModal
                  flag={editingFlag}
                  open={editOpen}
                  onClose={() => setEditOpen(false)}
                  onSaved={onFlagSaved}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={addFlag}
        className="border-t border-gray-100 pt-4 space-y-2"
      >
        <h5 className="text-sm font-semibold cursor-default text-gray-900">
          Create new flag
        </h5>
        <div className="grid grid-cols-2 gap-2">
          <input
            className="border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 px-3 py-2 bg-white/80"
            placeholder="Flag name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white/80"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
          >
            <option value="development">Development</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </select>
        </div>
        <textarea
          className="border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 px-3 py-2 bg-white/80 w-full"
          placeholder="Flag description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-gray-700">Flag enabled</span>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="appearance-none w-10 h-5 bg-gray-200 rounded-full cursor-pointer relative transition-colors duration-200 outline-none
              before:content-[''] before:absolute before:left-0 before:top-0 before:w-10 before:h-5 before:rounded-full before:transition-colors
              checked:bg-blue-500
              after:content-[''] after:absolute after:left-0.5 after:top-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow after:transition-transform
              checked:after:translate-x-5"
            style={{
              position: "relative",
              minWidth: "2.5rem",
              minHeight: "1.25rem",
            }}
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 mt-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 font-semibold hover:bg-blue-700"
        >
          Add Flag
        </button>
      </form>
    </div>
  );
}

function ProjectSettings({
  project,
  onUpdated,
  onDeleted,
}: {
  project: Project;
  onUpdated: (p: Project) => void;
  onDeleted: (id: string) => void;
}) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [saving, setSaving] = useState(false);
  const [toastInfo, setToast] = useState<{
    text: string;
    tone?: "success" | "error";
  } | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/projects/updateProject`, {
        projectId: project._id,
        name,
        description,
      });
      console.log("Response1", res);
      onUpdated(res.data.data);
      ToastTrigger({ message: "Project updated" });
    } catch (err: any) {
      setToast({ text: handleAxiosError(err), tone: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 1800);
    }
  };

  const remove = async () => {
    if (
      !confirm(
        `Delete project "${project.name}"? This will remove its flags too.`
      )
    )
      return;
    try {
      await api.delete(`/projects/deleteProject/${project._id}`);
      onDeleted(project._id);
    } catch (err: any) {
      setToast({ text: handleAxiosError(err), tone: "error" });
      setTimeout(() => setToast(null), 1800);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <form onSubmit={save} className="space-y-3">
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white/70"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white/70"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button
            onClick={remove}
            className="bg-red-100 text-red-700 px-4 py-3 rounded-lg hover:bg-red-200 font-semibold"
          >
            <Trash2 />
          </button>
        </div>
      </form>

      <div className="border-t border-gray-100 pt-4"></div>
    </div>
  );
}

function ProjectDrawer({
  project,
  open,
  onClose,
  onProjectUpdated,
  onProjectDeleted,
}: {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  onProjectUpdated: (p: Project) => void;
  onProjectDeleted: (id: string) => void;
}) {
  const [tab, setTab] = useState<"flags" | "settings">("flags");
  useEffect(() => {
    if (open) setTab("flags");
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={project ? project.name : "Project"}
    >
      {project && (
        <div>
          <div className="flex gap-2 border-b border-gray-200 mb-4">
            <button
              onClick={() => setTab("flags")}
              className={`px-3 py-2 text-sm rounded-t cursor-pointer ${
                tab === "flags"
                  ? "bg-gray-50 text-gray-900 border border-gray-200 border-b-transparent"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Flags
            </button>
            <button
              onClick={() => setTab("settings")}
              className={`px-3 py-2 text-sm rounded-t cursor-pointer ${
                tab === "settings"
                  ? "bg-gray-50 text-gray-900 border border-gray-200 border-b-transparent"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Settings
            </button>
          </div>

          {tab === "flags" ? (
            <FlagsSection projectId={project._id} />
          ) : (
            <ProjectSettings
              project={project}
              onUpdated={onProjectUpdated}
              onDeleted={(id) => {
                onProjectDeleted(id);
                onClose();
              }}
            />
          )}
        </div>
      )}
    </Modal>
  );
}

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [toastInfo, setToast] = useState<{
    text: string;
    tone?: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  const loadProjects = async () => {
    setPageLoading(true);
    try {
      const res = await api.get("/projects/getAllProjectsByUser");
      setProjects(res.data.data || []);
    } catch (err: any) {
      setProjects([]);
      setToast({ text: handleAxiosError(err), tone: "error" });
      setTimeout(() => setToast(null), 1800);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadProjects();
  }, [user]);

  const onOpenProject = (p: Project) => {
    setActiveProject(p);
    setDrawerOpen(true);
  };
  const onProjectCreated = (p: Project) => setProjects((prev) => [p, ...prev]);
  const onProjectUpdated = (p: Project) =>
    setProjects((prev) =>
      prev.map((x) => (x._id === p._id ? { ...x, ...p } : x))
    );
  const onProjectDeleted = (id: string) =>
    setProjects((prev) => prev.filter((x) => x._id !== id));

  const handleLogout = async () => {
    try {
      const res = await api.post(`/users/logout`, {});
      if (res.status === 200) {
        toast.success("Logout successful");
        router.push("/");
      }
    } catch (e) {
      toast.error("Error while logging out");
    }
  };

  if (loading || (!user && !loading)) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const capitalize = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  let userName = user?.fullName
    ? `, ${capitalize(user.fullName)}`
    : user?.username
    ? `, ${capitalize(user.username)}`
    : "";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome<span>{userName}</span>
            </h1>
            <p className="text-sm text-gray-700">
              Manage your projects and feature flags in one place.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {user?.api_key && (
              <div className="flex items-center gap-2 text-xs text-gray-800 bg-white/50 border border-gray-200 shadow-xs rounded-lg px-3 py-2 font-mono">
                <span>API Key: {user.api_key}</span>
                <button
                  type="button"
                  title="Copy API Key"
                  className="ml-1 p-1 rounded hover:bg-gray-200 cursor-pointer transition"
                  onClick={() => {
                    navigator.clipboard.writeText(user.api_key);
                    ToastTrigger({ message: "API key copied to clipboard" });
                  }}
                >
                  <CopyIcon />
                </button>
              </div>
            )}
            <button className="cursor-pointer" onClick={handleLogout}>
              <LogOut />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CreateProjectPanel onCreated={onProjectCreated} />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  Your Projects
                </h2>
                <button
                  onClick={loadProjects}
                  className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Refresh
                </button>
              </div>

              {pageLoading ? (
                <div className="text-gray-700 text-sm">Loading projects...</div>
              ) : projects.length === 0 ? (
                <div className="text-gray-700 text-sm">
                  No projects yet. Create your first project on the left.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.map((p) => (
                    <ProjectCard
                      key={p._id}
                      project={p}
                      onOpen={onOpenProject}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProjectDrawer
        project={activeProject}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onProjectUpdated={onProjectUpdated}
        onProjectDeleted={onProjectDeleted}
      />

      <style jsx global>{`
        .animate-gradient {
          animation: gradientShift 12s ease infinite;
        }
        @keyframes gradientShift {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

function EditFlagModal({
  flag,
  open,
  onClose,
  onSaved,
}: {
  flag: Flag | null;
  open: boolean;
  onClose: () => void;
  onSaved: (updated: Flag) => void;
}) {
  if (!open || !flag) return null;

  const [name, setName] = React.useState(flag.name);
  const [description, setDescription] = React.useState(flag.description ?? "");
  const [environment, setEnvironment] = React.useState(
    (flag.environment as string) || "development"
  );
  const [enabled, setEnabled] = React.useState(
    flag.isEnabled === true || flag.isEnabled === "true"
  );
  const [saving, setSaving] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        flagId: flag._id,
        name: name,
        description: description,
        environment: environment,
        isEnabled: enabled.toString(),
      };
      console.log(payload);
      const res = await api.put("/flags/updateFlag", payload);
      onSaved(res.data.data);
      toast.success("Flag updated");
      onClose();
    } catch (err: any) {
      toast.error(handleAxiosError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[540px] bg-white shadow-2xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl cursor-default font-semibold">Edit Flag</h3>
          <button
            onClick={onClose}
            className="text-gray-500 cursor-pointer hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white/70"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Flag name"
            required
          />
          <textarea
            className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white/70"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Flag description"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 bg-white/80"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
            >
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>

            <label className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-gray-700">Flag enabled</span>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="appearance-none w-10 h-5 bg-gray-200 rounded-full cursor-pointer relative transition-colors duration-200 outline-none
              before:content-[''] before:absolute before:left-0 before:top-0 before:w-10 before:h-5 before:rounded-full before:transition-colors
              checked:bg-blue-500
              after:content-[''] after:absolute after:left-0.5 after:top-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow after:transition-transform
              checked:after:translate-x-5"
                style={{
                  position: "relative",
                  minWidth: "2.5rem",
                  minHeight: "1.25rem",
                }}
              />
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer font-semibold hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg cursor-pointer border border-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
