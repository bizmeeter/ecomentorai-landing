import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ChapterQuestions({ chapter = "1" }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("chapter", chapter)
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching questions:", error.message);
        setQuestions([]);
      } else {
        setQuestions(data || []);
      }
      setLoading(false);
    };

    fetchQuestions();
  }, [chapter]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">
        Questions from Chapter {chapter}
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading questions...</p>
      ) : questions.length === 0 ? (
        <p className="text-center text-gray-600">No questions found.</p>
      ) : (
        <ul className="space-y-3">
          {questions.map((q, i) => (
            <li key={q.id} className="border p-3 rounded shadow">
              <strong>{i + 1}.</strong> {q.question}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
