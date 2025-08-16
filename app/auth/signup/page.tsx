"use client";
import React, { useState } from "react";
import Button from "../../../components/Buttons/Button";
import axios from "axios";
import "../../Utils/animate-gradient.css";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../../../components/CommonUtils/api";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const toastId = toast.loading("Loading....");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/users/signup`,
        { username, email, password },
        { withCredentials: true }
      );

      if (res.data.success == true) {
        toast.success("Signup successful");
        router.push("/auth/login");
      }
      setLoading(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Signup failed");
      setLoading(false);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 animate-gradient bg-[length:200%_200%]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center transition-all duration-500">
        <p className="text-3xl font-extrabold text-gray-700 mb-2">
          Create Account
        </p>
        <p className="text-gray-900/80 mb-6 text-center">
          Sign up to get started
        </p>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Email
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-white/60 backdrop-blur focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@gmail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Password
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-white/60 backdrop-blur focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
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
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <p className="mt-6 text-sm text-gray-800">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
