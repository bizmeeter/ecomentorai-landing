// components/ChapterOneQuestions.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { sendEmailAutoReply } from "../lib/sendEmail";
import AskEcomentorAI from "./AskEcomentorAI";

const ChapterOneQuestions = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    platform: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const questions_summary = `
Who is your target audience?: ${form.q1}
What problems does your product solve?: ${form.q2}
What is your current monthly revenue?: ${form.q3}
What channels are you currently using to sell?: ${form.q4}
What is your ultimate goal for this business?: ${form.q5}
What makes your offering unique?: ${form.q6}
What is the core product or service you offer?: ${form.q7}
    `.trim();

    const ai_reply = "Thanks! We'll analyze your input and get back to you soon.";
    const title = "Chapter 1 Submission";

    await supabase.from("beta_signups").insert([
      {
        name: form.name,
        email: form.email,
        platform: form.platform,
        questions_summary,
        ai_reply
      }
    ]);

    await sendEmailAutoReply({
      name: form.name,
      email: form.email,
      platform: form.platform,
      questions_summary,
      ai_reply,
      title
    });

    navigate("/thank-you");
  };

  const fields = [
    { label: "Full Name", name: "name", type: "text" },
    { label: "Email Address", name: "email", type: "email" },
    { label: "Platform (e.g. Shopify, WIX, WooCommerce)", name: "platform", type: "text", span: true },
    { label: "Who is your target audience?", name: "q1", type: "textarea" },
    { label: "What problems does your product solve?", name: "q2", type: "textarea" },
    { label: "What is your current monthly revenue?", name: "q3", type: "text" },
    { label: "What channels are you currently using to sell?", name: "q4", type: "textarea" },
    { label: "What is your ultimate goal for this business?", name: "q5", type: "text" },
    { label: "What makes your offering unique?", name: "q6", type: "textarea", span: true },
    { label: "What is the core product or service you offer?", name: "q7", type: "textarea", span: true },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-12 text-black font-sans">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">📘 Before We Start, Let's Get To Know You</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(({ label, name, type, span }) => (
          <div key={name} className={`${span ? "md:col-span-2" : ""} flex flex-col`}>
            <label className="text-sm font-medium mb-1">{label}</label>
            {type === "textarea" ? (
              <textarea
                name={name}
                value={form[name]}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm min-h-[48px] resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}

        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md w-full hover:bg-blue-700 font-semibold"
          >
            Submit Answers
          </button>
        </div>
      </form>

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-md md:col-span-2">
        <AskEcomentorAI />
      </div>
    </div>
  );
};

export default ChapterOneQuestions;
