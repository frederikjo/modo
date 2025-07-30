"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);

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

  if (loading) return <p className="p-8 text-center">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to Modo 👋</h1>
      <p className="text-muted mt-2">Plan: {settings?.plan}</p>
      <p className="text-muted mt-2">
        Weight Unit: {settings?.preferred_unit}
      </p>
    </div>
  );
}
