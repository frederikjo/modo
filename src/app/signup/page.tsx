"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

type SignupInputs = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  preferredUnit: "kg" | "lbs";
  plan: "Free" | "Premium" | "Enterprise";
};

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInputs>();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: SignupInputs) => {
    setError(null);

    const { data: signUpData, error: signUpError } =
      await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

    if (signUpError || !signUpData.user) {
      setError(signUpError?.message || "Signup failed");
      return;
    }

    const { error: insertError } = await supabase
      .from("user_settings")
      .insert({
        user_id: signUpData.user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        preferred_unit: data.preferredUnit,
        plan: data.plan,
      });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white dark:bg-brand-primary p-8 rounded shadow-md w-full max-w-md"
    >
      <h2 className="text-xl font-semibold mb-4">Create Account</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input
        className="mb-4 w-full p-2 border border-gray-300 rounded text-black"
        placeholder="Email"
        type="email"
        {...register("email", { required: "Email is required" })}
      />
      <input
        className="mb-4 w-full p-2 border border-gray-300 rounded text-black"
        placeholder="Password"
        type="password"
        {...register("password", {
          required: "Password is required",
        })}
      />
      <input
        className="mb-4 w-full p-2 border border-gray-300 rounded text-black"
        placeholder="First Name"
        {...register("firstName", {
          required: "First name is required",
        })}
      />
      <input
        className="mb-4 w-full p-2 border border-gray-300 rounded text-black"
        placeholder="Last Name"
        {...register("lastName", {
          required: "Last name is required",
        })}
      />

      <div className="mb-4">
        <label className="block mb-1 text-sm">Preferred Unit</label>
        <select
          className="w-full p-2 border border-gray-300 rounded text-black"
          {...register("preferredUnit")}
        >
          <option value="kg">Kilograms</option>
          <option value="lbs">Pounds</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm">Plan</label>
        <select
          className="w-full p-2 border border-gray-300 rounded text-black"
          {...register("plan")}
        >
          <option value="Free">Free</option>
          <option value="Premium">Premium</option>
          <option value="Enterprise">Enterprise</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-orange-500 text-black font-semibold py-2 rounded hover:bg-transparent border-1 border-orange-500 cursor-pointer transition"
      >
        Sign Up
      </button>
    </form>
  );
}
