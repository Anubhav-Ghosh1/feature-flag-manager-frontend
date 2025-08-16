import React, { useState } from "react";
import Button from "../../../components/Buttons/Button";
import "../CommonUtils/AuthForm.css";
import axios from "axios";
import { API_BASE_URL } from "../../../components/CommonUtils/api";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/users/signup`,
        { username, email, password },
        { withCredentials: true }
      );
      // TODO: handle signup success (e.g., redirect, set user context)
      setLoading(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form className="auth-form flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="font-medium">Username</label>
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label className="font-medium">Email</label>
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="font-medium">Password</label>
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label className="font-medium">Confirm Password</label>
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
};

export default Signup;
