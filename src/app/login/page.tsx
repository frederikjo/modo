"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [preferredUnit, setPreferredUnit] = useState<"kg" | "lbs">(
    "kg"
  );
  const [plan, setPlan] = useState<"Free" | "Premium" | "Enterprise">(
    "Free"
  );
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSigningUp) {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError || !signUpData.user?.id) {
        setError(signUpError?.message || "Signup failed");
        return;
      }

      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      const userId = signInData?.user?.id;

      if (!userId || signInError) {
        setError(
          signInError?.message || "Could not sign in after signup"
        );
        return;
      }

      // Insert user settings
      const { error: insertError } = await supabase
        .from("user_settings")
        .insert({
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          preferred_unit: preferredUnit,
          plan,
        });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      router.push("/dashboard");
    } else {
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-brand-primary text-black dark:text-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isSigningUp ? "Create Account" : "Login"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full p-2 border border-gray-300 rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full p-2 border border-gray-300 rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {isSigningUp && (
          <>
            <input
              type="text"
              placeholder="First Name"
              className="mb-4 w-full p-2 border border-gray-300 rounded text-black"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="mb-4 w-full p-2 border border-gray-300 rounded text-black"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <label className="block text-sm mb-1">
              Preferred Unit
            </label>
            <select
              className="mb-4 w-full p-2 border border-gray-300 rounded text-black"
              value={preferredUnit}
              onChange={(e) =>
                setPreferredUnit(e.target.value as "kg" | "lbs")
              }
            >
              <option value="kg">Kilograms</option>
              <option value="lbs">Pounds</option>
            </select>

            <label className="block text-sm mb-1">Plan</label>
            <select
              className="mb-4 w-full p-2 border border-gray-300 rounded text-black"
              value={plan}
              onChange={(e) =>
                setPlan(
                  e.target.value as "Free" | "Premium" | "Enterprise"
                )
              }
            >
              <option value="Free">Free</option>
              <option value="Premium">Premium</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-orange-500 text-black font-semibold py-2 rounded hover:bg-transparent border-1 border-orange-500 cursor-pointer transition"
        >
          {isSigningUp ? "Create Account" : "Log In"}
        </button>

        <p className="text-sm text-center mt-4 text-black">
          {isSigningUp
            ? "Already have an account?"
            : "Need an account?"}
          <button
            type="button"
            onClick={() => setIsSigningUp(!isSigningUp)}
            className="text-brand-accent hover:underline ml-2 cursor-pointer text-orange-500"
          >
            {isSigningUp ? "Log in" : "Sign up"}
          </button>
        </p>

        <a href="/signup">Dont have an account?</a>
      </form>
    </div>
  );
}
