"use client";
import React, { use, useState } from "react";
import Button from "../../../components/Buttons/Button";
import axios from "axios";
import "../../Utils/animate-gradient.css";
import { API_BASE_URL } from "../../../components/CommonUtils/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useContextStore } from "@/context/Store";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, setField } = useContextStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/users/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res.data.statusCode);
      if (res.data.statusCode !== 200) {
        toast.error(res.data.message);
      }
      router.push("/dashboard")
      toast.success("Login successful!");
      setField("user", res.data.data);
      setLoading(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 animate-gradient bg-[length:200%_200%]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-gray-700 mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500 mb-6 text-center">
          Sign in to your account to continue
        </p>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@gmail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/auth/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
