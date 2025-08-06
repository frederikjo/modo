"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/hooks/useTheme";

import { User } from "@supabase/supabase-js";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { Header } from "../components/layout/Header";
import { HabitTracker } from "../components/habits/HabitTracker";

export default function HabitsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <DashboardLayout isDark={isDark}>
        <div className="flex items-center justify-center min-h-screen">
          <div
            className={`text-center ${
              isDark ? "text-slate-200" : "text-slate-800"
            }`}
          >
            <p className="font-light">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isDark={isDark}>
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <HabitTracker isDark={isDark} />
    </DashboardLayout>
  );
}
