"use client";
import { UserProvider } from "../../context/UserContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
