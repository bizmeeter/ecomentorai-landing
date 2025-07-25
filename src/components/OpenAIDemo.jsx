import React, { useState } from "react";

// מאגר שאלות/תשובות לדמו בלבד
const faqDatabase = {
  "what is affiliate marketing?": {
    answer:
      "Affiliate marketing is a relationship system where a partner (Affiliate) refers customers to a specific business in exchange for a pre-determined commission, usually per sale or lead.",
    chapter: "📘 Would you like to read more? Go to Chapter 11.10",
  },
};

const OpenAIDemo = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [chapterSuggestion, setChapterSuggestion] = useState("");
  const [notFound, setNotFound] = useState(false);

  const handleGenerateResponse = () => {
    const userQuestion = question.trim().toLowerCase();

    if (faqDatabase[userQuestion]) {
      setResponse(faqDatabase[userQuestion].answer);
      setChapterSuggestion(faqDatabase[userQuestion].chapter);
      setNotFound(false);
    } else {
      setResponse(null);
      setChapterSuggestion("");
      setNotFound(true);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "700px" }}>
      <h2>🤖 Ask your AI Mentor</h2>

      <textarea
        rows="3"
        cols="60"
        placeholder="Ask me anything..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ fontSize: "1rem", padding: "0.5rem" }}
      />
      <br />
      <button onClick={handleGenerateResponse} style={{ marginTop: "1rem" }}>
        Generate AI Response
      </button>

      <div style={{ marginTop: "2rem" }}>
        {response && (
          <>
            <h3>✅ AI Response:</h3>
            <p style={{ fontSize: "1.1rem" }}>{response}</p>
            <p style={{ color: "#555", fontStyle: "italic" }}>{chapterSuggestion}</p>
            <hr />
            <p>💡 Want to ask another question?</p>
          </>
        )}

        {notFound && (
          <>
            <h3>⚠️ No answer found in our knowledge base.</h3>
            <p>We’ll check EcomentorAI for a deeper response...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OpenAIDemo;
