import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const MentorEngine = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [chapterInfo, setChapterInfo] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const [keywords, setKeywords] = useState([]);
  const [keywordsQuestions, setKeywordsQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [chapters, setChapters] = useState([]);

  const userId = "demo"; // TODO: להחליף ל־user_id דינמי מהמערכת

  // שליפה ראשונית של כל הנתונים
  useEffect(() => {
    const loadData = async () => {
      const { data: kw } = await supabase.from("keywords").select("*");
      const { data: kq } = await supabase.from("keywords_questions").select("*");
      const { data: qs } = await supabase.from("questions").select("*");
      const { data: ch } = await supabase.from("chaptersa").select("*");

      setKeywords(kw || []);
      setKeywordsQuestions(kq || []);
      setQuestions(qs || []);
      setChapters(ch || []);
    };

    loadData();
  }, []);

  const handleSearch = async () => {
    const userInput = question.trim().toLowerCase();
    setLoading(true);
    setResponse(null);
    setChapterInfo("");
    setNotFound(false);

    // שלב 1: זיהוי מילת מפתח
    const matchedKeyword = keywords.find((k) =>
      userInput.includes(k.name.toLowerCase())
    );

    if (!matchedKeyword) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // שלב 2: מציאת שאלת יעד
    const linked = keywordsQuestions.find((link) => link.keyword_id === matchedKeyword.id);
    if (!linked) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // שלב 3: שליפת שאלה + תשובה
    const matchedQuestion = questions.find((q) => q.id === linked.question_id);
    if (!matchedQuestion) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // שלב 4: שליפת מידע על הפרק
    const chapter = chapters.find((c) => c.chapter_number === matchedQuestion.chapter_number);
    const chapterTitle = chapter ? `${chapter.chapter_number}. ${chapter.short_title}` : "";

    // שלב 5: שמירה לטבלת user_answers
    await supabase.from("user_answers").upsert([
      {
        user_id: userId,
        question_id: matchedQuestion.id,
        question_text: matchedQuestion.question_text,
        answer_text: matchedQuestion.answer || "[No predefined answer]",
        chapter_number: matchedQuestion.chapter_number,
      },
    ]);

    // שלב 6: הצגת התוצאה
    setResponse(matchedQuestion.answer || "[No predefined answer]");
    setChapterInfo(chapterTitle ? `📘 From Chapter: ${chapterTitle}` : "");
    setNotFound(false);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧠 Mentor Engine</h2>

      <textarea
        rows="3"
        className="w-full border p-3 rounded"
        placeholder="Ask your business question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      ></textarea>

      <button
        onClick={handleSearch}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Searching..." : "Generate Response"}
      </button>

      {response && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">✅ Response:</h3>
          <p className="mb-2">{response}</p>
          <p className="text-sm italic text-gray-500">{chapterInfo}</p>
        </div>
      )}

      {notFound && (
        <div className="mt-6 text-yellow-700">
          ⚠️ No answer found in your knowledge base.<br />
          We’ll send this to EcomentorAI in the next version...
        </div>
      )}
    </div>
  );
};

export default MentorEngine;
