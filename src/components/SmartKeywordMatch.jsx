// SmartKeywordMatch.jsx
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const SmartKeywordMatch = () => {
  const [userQuestion, setUserQuestion] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!userQuestion.trim()) return;
    setLoading(true);
    setMatchResult(null);

    const { data: keywords } = await supabase.from("keywords").select("keyword, chapter_number");

    const found = keywords.find((k) => {
      const keyword = k.keyword.toLowerCase();
      return userQuestion.toLowerCase().includes(keyword);
    });

    if (found) {
      setMatchResult({ keyword: found.keyword, chapter: found.chapter_number });
    } else {
      setMatchResult({ keyword: null });
    }

    setLoading(false);
  };

  return (
    <div className="mt-12 p-6 bg-white border rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold">🤖 Ask EcomentorAI</h2>
      <p className="text-sm text-gray-600">Type your business question, and we'll find the best match from the book:</p>

      <input
        type="text"
        value={userQuestion}
        onChange={(e) => setUserQuestion(e.target.value)}
        placeholder="e.g. what is affiliate marketing"
        className="w-full p-2 border rounded"
      />

      <button
        onClick={handleSearch}
        disabled={loading || !userQuestion.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        {loading ? "Thinking..." : "Ask EcomentorAI"}
      </button>

      {matchResult && (
        <div className="mt-4">
          {matchResult.keyword ? (
            <div className="text-green-700">
              ✅ Match found for: <strong>{matchResult.keyword}</strong><br />
              <button
                onClick={() => navigate(`/chapter/${matchResult.chapter}`)}
                className="mt-2 underline text-blue-600 hover:text-blue-800"
              >
                Go to Chapter {matchResult.chapter}
              </button>
            </div>
          ) : (
            <div className="text-red-600">❌ No relevant topic found yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartKeywordMatch;
