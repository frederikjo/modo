"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Target, Moon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/hooks/useTheme";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { Header } from "../components/layout/Header";
import { WellnessChart } from "../components/dashboard/WellnessChart";
import { DailyGoalsWidget } from "../components/dashboard/DailyGoalsWidget";
import { CalendarWidget } from "../components/dashboard/CalendarWidget";
import { MetricCard } from "../components/dashboard/MetricCard";
import { RecentActivity } from "../components/dashboard/RecentActivity";
import { User } from "@supabase/supabase-js";

interface UserSettings {
  id: string;
  user_id: string;
  preferred_unit: string;
  plan: string;
  created_at?: string;
  updated_at?: string;
}
export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const getUserAndSettings = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      const user = session.user;
      setUser(user);

      // Upsert user_settings
      await supabase.from("user_settings").upsert({
        user_id: user.id,
        preferred_unit: "kg",
        plan: "Free",
      });

      // Get settings
      const { data: userSettings } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setSettings(userSettings);
      setLoading(false);
    };

    getUserAndSettings();
  }, [router]);

  if (loading)
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark
            ? "bg-slate-900 text-slate-200"
            : "bg-slate-50 text-slate-800"
        }`}
      >
        <p className="text-center">Loading...</p>
      </div>
    );

  return (
    <DashboardLayout isDark={isDark}>
      <Header isDark={isDark} toggleTheme={toggleTheme} />

      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Chart - Large */}
          <div className="col-span-8">
            <WellnessChart isDark={isDark} />
          </div>

          {/* Right Sidebar */}
          <div className="col-span-4 space-y-6">
            <DailyGoalsWidget isDark={isDark} />
            <CalendarWidget isDark={isDark} />
          </div>

          {/* Bottom Row */}
          <div className="col-span-3">
            <MetricCard
              title="Daily Steps"
              value="7,842"
              subtitle="Goal: 10,000"
              icon={Target}
              color="bg-slate-600"
              isDark={isDark}
            />
          </div>

          <div className="col-span-3">
            <MetricCard
              title="Heart Rate"
              value="72 bpm"
              subtitle="Resting rate"
              icon={Heart}
              color="bg-slate-500"
              isDark={isDark}
            />
          </div>

          <div className="col-span-3">
            <MetricCard
              title="Sleep Score"
              value="8.2h"
              subtitle="Quality: Good"
              icon={Moon}
              color="bg-slate-700"
              isDark={isDark}
            />
          </div>

          <div className="col-span-3">
            <RecentActivity isDark={isDark} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
