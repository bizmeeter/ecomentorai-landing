// components/AskEcomentorAI.jsx
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AskEcomentorAI = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    const user_id = localStorage.getItem("user_id") || "unknown";

    const { data, error } = await supabase.rpc("get_answer_by_keyword", {
      user_question: question,
      user_id,
    });

    if (error || !data) {
      setAnswer("Sorry, we couldn't find an answer. Please try again later.");
    } else {
      setAnswer(data.answer_text || "No answer found.");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm">
      <h3 className="text-xl font-semibold text-blue-800 mb-4">🤖 Ask Anything</h3>

      <div className="flex flex-col gap-4 mb-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your question here..."
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-md text-sm min-h-[80px] resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium self-start"
          onClick={handleAsk}
          disabled={loading}
        >
          {loading ? "Searching..." : "Ask EcomentorAI"}
        </button>
      </div>

      {answer && (
        <div className="bg-white border border-gray-200 p-4 rounded-md text-sm leading-relaxed shadow-inner">
          <strong className="text-blue-700 block mb-1">💡 Answer:</strong>
          {answer}
        </div>
      )}
    </div>
  );
};

export default AskEcomentorAI;
