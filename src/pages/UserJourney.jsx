import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const UserJourney = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [onboarding, setOnboarding] = useState([]);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const loadUserAndData = async () => {
      const { data: userData } = await supabase.from("users").select("*").eq("id", id).single();
      setUser(userData);

      const onboardingData = [
        { question: "What is your business name?", answer: userData?.business_name || "" },
        { question: "What industry are you in?", answer: userData?.store_type || "" },
        { question: "What do you currently sell?", answer: userData?.target_goals || "" },
        { question: "Where do you currently sell?", answer: "Shopify / WooCommerce / etc." },
        { question: "Who is your main audience?", answer: userData?.audience_profile || "" },
      ];

      setOnboarding(onboardingData);
    };

    loadUserAndData();
  }, [id]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const questionText = question.toLowerCase();
    let answer = "";
    let chapterRef = "";
    let keyword = "";
    let personalization = "";

    if (questionText.includes("affiliate")) {
      keyword = "affiliate";
      answer = "You can recruit affiliates by reaching out to influencers who promote similar products.";
      chapterRef = "11.10 – Affiliate Marketing";
      personalization = `User audience: ${user?.audience_profile}`;
    } else {
      keyword = "general";
      answer = "We didn’t find a perfect match, but will continue learning from your feedback.";
      chapterRef = "–";
      personalization = "User question didn’t match known keywords.";
    }

    setResponse({ answer, reference: chapterRef, personalized: personalization });

    const { error } = await supabase.from("user_questions").insert([
      {
        user_id: user?.id,
        question_text: question,
        answer_text: answer,
        matched_keyword: keyword,
        chapter_reference: chapterRef,
        personalization_note: personalization,
        rating: null,
      },
    ]);

    if (error) {
      console.error("❌ Error saving question:", error.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">📋 User Journey</h2>

      {user && (
        <div className="mb-6">
          <p><strong>🧑 Name:</strong> {user.full_name}</p>
          <p><strong>📧 Email:</strong> {user.email}</p>
          <p><strong>💼 Plan:</strong> {user.plan}</p>
          <p><strong>🧩 User Type:</strong> {user.user_type}</p>
          <p><strong>🚀 Current Progress:</strong> Chapter {user.onboarding_stage || "–"}</p>
        </div>
      )}

      <h3 className="text-lg font-semibold mb-2">📝 Onboarding Summary</h3>
      <ul className="list-disc ml-6 mb-6">
        {onboarding.map((item, idx) => (
          <li key={idx}><strong>{item.question}</strong> – {item.answer}</li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold mb-2">🎯 Ask a Question for this User</h3>
      <textarea
        rows="3"
        className="w-full p-2 border rounded mb-2"
        placeholder="e.g., How can I recruit affiliates?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleAsk}
      >
        Ask
      </button>

      {response && (
        <div className="mt-6 bg-gray-50 p-4 border rounded">
          <h4 className="font-semibold text-green-700 mb-1">✅ Response:</h4>
          <p>{response.answer}</p>
          <p className="text-sm text-gray-500 mt-1 italic">{response.reference}</p>
          <p className="mt-2 text-blue-800">{response.personalized}</p>
        </div>
      )}
    </div>
  );
};

export default UserJourney;
