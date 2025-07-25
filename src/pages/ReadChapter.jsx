import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ReadChapter() {
  const { chapter_number } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("chaptersa")
        .select("*")
        .eq("chapter_number", chapter_number)
        .maybeSingle();

      if (error) {
        setError(error.message);
      } else if (!data) {
        setError("Chapter not found");
      } else {
        setChapter(data);
      }

      setLoading(false);
    };

    fetchChapter();
  }, [chapter_number]);

  if (loading) return <p>Loading chapter...</p>;
  if (error) return <p className="text-red-600">❌ Error loading chapter: {error}</p>;

  return (
    <div className="flex flex-row gap-8">
      {/* תוכן הפרק */}
      <div className="w-3/5">
        <h1 className="text-3xl font-bold mb-4">{chapter.name}</h1>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: chapter.content_html }}
        />
      </div>

      {/* אזור צד ימין */}
      <div className="w-2/5 space-y-6">
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-2">📌 Questions in this Chapter</h2>
          {/* כאן יופיעו השאלות */}
        </div>

        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-2">📝 Tasks</h2>
          {/* כאן יופיעו משימות */}
        </div>

        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-2">🤖 Ask the System</h2>
          {/* כאן יופיע רכיב השאלה המהירה */}
        </div>
      </div>
    </div>
  );
}
