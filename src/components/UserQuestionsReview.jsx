import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function UserQuestionsReview({ userId }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_questions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) console.error("Error loading questions:", error);
      else setQuestions(data);
      setLoading(false);
    };

    if (userId) fetchQuestions();
  }, [userId]);

  const handleSaveRating = async (id) => {
    if (!selectedRating) return;

    const { error } = await supabase
      .from("user_questions")
      .update({ rating: parseInt(selectedRating) })
      .eq("id", id);

    if (error) {
      console.error("Error saving rating:", error);
    } else {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, rating: parseInt(selectedRating) } : q
        )
      );
      setEditingId(null);
      setSelectedRating(null);
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <p>Loading questions...</p>
      ) : (
        questions.map((q) => (
          <Card key={q.id}>
            <CardContent className="p-4 space-y-2">
              <div><strong>📝 Question:</strong> {q.question_text}</div>
              <div><strong>💬 Answer:</strong> {q.answer_text}</div>
              <div><strong>🔑 Matched Keyword:</strong> {q.matched_keyword || "—"}</div>
              <div><strong>📚 Chapter Reference:</strong> {q.chapter_reference || "—"}</div>
              <div><strong>🧠 Personalization Note:</strong> {q.personalization_note || "—"}</div>
              <div><strong>📅 Date:</strong> {new Date(q.created_at).toLocaleString()}</div>

              {q.rating ? (
                <div><strong>⭐ Rating:</strong> {q.rating}/10</div>
              ) : editingId === q.id ? (
                <div className="flex items-center gap-2">
                  <Select onValueChange={setSelectedRating}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="Rate" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={() => handleSaveRating(q.id)}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setEditingId(q.id)}>
                  Rate Answer
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
