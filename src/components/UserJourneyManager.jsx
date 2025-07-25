import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import UserQuestionsReview from "./UserQuestionsReview";
import AdminRecommendationForm from "./AdminRecommendationForm";

const UserJourneyManager = () => {
  const [user, setUser] = useState(null);
  const [onboarding, setOnboarding] = useState([]);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const loadUserAndData = async () => {
      const { data: users } = await supabase
        .from("users")
        .select("*")
        .eq("email", "test@example.com"); // שנה לפי הצורך

      if (users && users.length > 0) {
        setUser(users[0]);
      }

      const onboardingData = [
        { question: "What is your business name?", answer: "Ben's Jewelry" },
        { question: "What industry are you in?", answer: "Fashion & Accessories" },
        { question: "What do you currently sell?", answer: "Handmade necklaces and bracelets" },
        { question: "Where do you currently sell?", answer: "Shopify, Etsy" },
        { question: "Who is your main audience?", answer: "Women aged 25–45 looking for unique gifts" }
      ];
      setOnboarding(onboardingData);
    };

    loadUserAndData();
  }, []);

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
      personalization = "Since the store sells fashion products, Instagram micro-influencers may be a good fit.";
    } else {
      keyword = "general";
      answer = "We didn’t find a perfect match, but will continue learning from your feedback.";
      chapterRef = "–";
      personalization = "User question didn’t match known keywords.";
    }

    const { data, error } = await supabase.from("user_questions").insert([
      {
        user_id: user?.id,
        question_text: question,
        answer_text: answer,
        matched_keyword: keyword,
        chapter_reference: chapterRef,
        personalization_note: personalization,
        rating: null,
      },
    ]).select().single();

    if (error) {
      console.error("❌ Error saving question:", error.message);
    } else {
      setResponse({
        answer,
        reference: chapterRef,
        personalized: personalization,
      });
      setQuestion("");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold">📋 User Journey – {user?.full_name || "User"}</h2>

      {user && (
        <div className="space-y-1">
          <p><strong>🧑 Name:</strong> {user.full_name || "–"}</p>
          <p><strong>📧 Email:</strong> {user.email}</p>
          <p><strong>💼 Plan:</strong> {user.plan}</p>
          <p><strong>🧩 User Type:</strong> {user.user_type}</p>
          <p><strong>🚀 Current Progress:</strong> Chapter {user.progress_chapter || "–"}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-1">📝 Onboarding Summary</h3>
        <ul className="list-disc ml-6">
          {onboarding.map((item, idx) => (
            <li key={idx}><strong>{item.question}</strong> – {item.answer}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-1">🎯 Ask a Question for this User</h3>
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
      </div>

      {response && (
        <div className="bg-gray-50 p-4 border rounded">
          <h4 className="font-semibold text-green-700 mb-1">✅ Response:</h4>
          <p>{response.answer}</p>
          <p className="text-sm text-gray-500 italic">{response.reference}</p>
          {response.personalized && (
            <p className="mt-2 text-blue-800">{response.personalized}</p>
          )}
        </div>
      )}

      {user?.id && (
        <>
          <div>
            <h3 className="text-lg font-bold">🧠 Review Questions & Rate Answers</h3>
            <UserQuestionsReview userId={user.id} />
          </div>

          <div>
            <h3 className="text-lg font-bold mt-8">📩 Admin Manual Recommendation</h3>
            <AdminRecommendationForm userId={user.id} />
          </div>
        </>
      )}
    </div>
  );
};

export default UserJourneyManager;
