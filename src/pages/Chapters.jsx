import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

function Chapters() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapters = async () => {
      const { data, error } = await supabase
        .from("chaptersa")
        .select("*")
        .order("chapter_number", { ascending: true });

      if (error) {
        console.error("❌ Error loading chapters:", error);
      } else {
        setChapters(data);
      }

      setLoading(false);
    };

    fetchChapters();
  }, []);

  const handleStartQuestions = (chapterNumber) => {
    console.log("✅ Clicking chapter", chapterNumber);
    navigate(`/questions/${chapterNumber}`);
  };

  const handleReadFullChapter = (chapterId) => {
    navigate(`/read-chapter/${chapterId}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📘 Chapters View</h1>

      {loading ? (
        <p>Loading chapters...</p>
      ) : chapters.length === 0 ? (
        <p>No chapters found.</p>
      ) : (
        chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="mb-6 p-5 border border-gray-200 rounded-xl shadow-sm bg-white"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span>{chapter.icon}</span> {chapter.chapter_number}. {chapter.short_title}
            </h2>
            <p className="text-gray-600 mt-1">{chapter.summary || "No summary yet."}</p>

            <div className="flex gap-4 mt-4 flex-wrap">
              <button
                onClick={() => handleStartQuestions(chapter.chapter_number)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                🧠 Start Questions
              </button>
              <button
                onClick={() => handleReadFullChapter(chapter.id)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                📖 Read Full Chapter
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Chapters;
