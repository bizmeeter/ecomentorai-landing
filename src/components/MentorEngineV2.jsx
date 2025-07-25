import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const MentorEngineV2 = () => {
  const [question, setQuestion] = useState("");
  const [matches, setMatches] = useState([]);
  const [noResult, setNoResult] = useState(false);

  const handleSearch = async () => {
    const userQuestion = question.toLowerCase();

    // 1. Fetch all keywords
    const { data: keywords } = await supabase.from("keywords").select("*");

    // 2. Check which keyword is included in user input
    const matchedKeyword = keywords.find((kw) =>
      userQuestion.includes(kw.name.toLowerCase())
    );

    if (!matchedKeyword) {
      setMatches([]);
      setNoResult(true);
      return;
    }

    // 3. Fetch all keyword-question mappings
    const { data: mappings } = await supabase
      .from("keywords_questions")
      .select("*")
      .eq("keyword_id", matchedKeyword.id);

    const questionIds = mappings.map((m) => m.question_id);

    // 4. Fetch all questions with those IDs
    const { data: allQuestions } = await supabase
      .from("questions")
      .select("*")
      .in("id", questionIds)
      .eq("is_active", true);

    if (allQuestions.length === 0) {
      setMatches([]);
      setNoResult(true);
    } else {
      setMatches(allQuestions);
      setNoResult(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px" }}>
      <h2>🧠 Mentor Engine V2</h2>

      <textarea
        rows="3"
        cols="60"
        placeholder="Ask your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ fontSize: "1rem", padding: "0.5rem" }}
      />
      <br />
      <button onClick={handleSearch} style={{ marginTop: "1rem" }}>
        Search
      </button>

      <div style={{ marginTop: "2rem" }}>
        {matches.length > 0 && (
          <>
            <h3>🔎 Found Relevant Results:</h3>
            {matches.map((q) => (
              <div key={q.id} style={{ marginBottom: "1rem" }}>
                <strong>Q:</strong> {q.question}
                <br />
                <a href={`/chapters/${q.chapter}`} target="_blank">
                  📘 Go to Chapter {q.chapter}
                </a>
              </div>
            ))}
          </>
        )}

        {noResult && (
          <>
            <h3>⚠️ No direct match found in the book.</h3>
            <p>
              Would you like to ask the community or try AI suggestion?
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default MentorEngineV2;
