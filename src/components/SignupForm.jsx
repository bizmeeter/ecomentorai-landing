// components/SignupForm.jsx
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const SignupForm = ({ onSignup }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    platform: "",
    affiliate: false,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const userId = form.email.trim().toLowerCase();
    localStorage.setItem("user_id", userId);

    const { error } = await supabase.from("signups").insert([
      {
        name: form.name,
        email: userId,
        platform: form.platform,
        wants_affiliate: form.affiliate,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      alert("❌ Failed to save. Please try again.");
      console.error(error);
    } else {
      if (onSignup) onSignup(userId);
    }

    setSubmitting(false);
  };

  return (
    <form
      className="flex flex-wrap gap-4 justify-center items-center bg-white p-6 rounded-xl shadow-md mb-6"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        className="border px-3 py-2 rounded w-64"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
        className="border px-3 py-2 rounded w-64"
        required
      />
      <input
        type="text"
        name="platform"
        placeholder="Platform (e.g. Shopify, WIX, WooCommerce)"
        value={form.platform}
        onChange={handleChange}
        className="border px-3 py-2 rounded w-64"
      />
      <label className="flex items-center text-sm">
        <input
          type="checkbox"
          name="affiliate"
          checked={form.affiliate}
          onChange={handleChange}
          className="mr-1"
        />
        I want to become an affiliate
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full font-semibold"
      >
        {submitting
          ? "Submitting..."
          : "Get invite for a beta with 50% discount, available for 100 customers. Save your spot. Be the 1st to know"}
      </button>
    </form>
  );
};

export default SignupForm;
