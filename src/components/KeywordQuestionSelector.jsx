import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const KeywordQuestionSelector = () => {
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");

  // שליפה ראשונית של מילות מפתח
  useEffect(() => {
    const fetchKeywords = async () => {
      const { data, error } = await supabase.from("keywords").select("keyword");
      if (!error && data) setKeywords(data.map((k) => k.keyword));
    };
    fetchKeywords();
  }, []);

  // שליפת שאלות לפי מילת מפתח
  const fetchQuestionsByKeyword = async (keyword) => {
    const { data, error } = await supabase
      .from("keywords_questions")
      .select("question")
      .eq("keyword", keyword);

    if (!error && data) setQuestions(data.map((q) => q.question));
  };

  const handleKeywordChange = (e) => {
    const keyword = e.target.value;
    setSelectedKeyword(keyword);
    setSelectedQuestion("");
    setAiAnswer("");
    fetchQuestionsByKeyword(keyword);
  };

  const handleQuestionClick = async (question) => {
    setSelectedQuestion(question);
    // דמו זמני – יוחלף במענה OpenAI בעתיד
    setAiAnswer("Great question! We'll get back with a smart answer soon.");
  };

  return (
    <div className="mt-8 p-6 border rounded-xl bg-white shadow-md">
      <h2 className="text-xl font-semibold mb-4">💡 Ask a Smart Question</h2>

      <label className="block mb-2 text-sm font-medium">Select a Topic:</label>
      <select
        value={selectedKeyword}
        onChange={handleKeywordChange}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">-- Choose a keyword --</option>
        {keywords.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>

      {questions.length > 0 && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Choose a Question:</label>
          <ul className="space-y-2">
            {questions.map((q, i) => (
              <li
                key={i}
                onClick={() => handleQuestionClick(q)}
                className="cursor-pointer p-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedQuestion && (
        <div className="mt-4 p-4 border-t">
          <h3 className="font-medium">🤖 AI Reply:</h3>
          <p className="text-gray-700 mt-2">{aiAnswer}</p>
        </div>
      )}
    </div>
  );
};

export default KeywordQuestionSelector;