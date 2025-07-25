import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { fetchChapterText, matchKeyword } from '../lib/knowledgeBase'; // חשוב!

function Questions() {
  const { chapterNumber } = useParams();
  const navigate = useNavigate();
  const chapterNum = parseInt(chapterNumber);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [overallInsight, setOverallInsight] = useState('');
  const [loading, setLoading] = useState(true);

  const userId = 'demo'; // בעתיד: מתוך auth

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: questionData } = await supabase
        .from('chapter_questions')
        .select('*')
        .eq('chapter_number', chapterNum);

      const { data: answerData } = await supabase
        .from('user_answers')
        .select('*')
        .eq('user_id', userId)
        .eq('chapter_number', chapterNum);

      const initialAnswers = {};
      answerData?.forEach((a) => {
        initialAnswers[a.question_id] = a.answer_text;
      });

      setQuestions(questionData || []);
      setAnswers(initialAnswers);
      setFeedback({});
      setOverallInsight('');
      setLoading(false);
    };

    fetchData();
  }, [chapterNum]);

  const handleInputChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const saveAllAnswers = async () => {
    const updates = questions.map((q) => ({
      user_id: userId,
      chapter_number: chapterNum,
      question_id: q.id,
      question_text: q.question_text,
      answer_text: answers[q.id] || '',
    }));

    const { error } = await supabase
      .from('user_answers')
      .upsert(updates, { onConflict: ['user_id', 'question_id'] });

    if (error) {
      alert('❌ Failed to save answers. Please try again.');
    } else {
      alert('✅ All answers saved successfully!');
    }
  };

  const generateOfflineInsights = async () => {
    const chapterText = await fetchChapterText(chapterNum);
    const perQuestion = {};

    questions.forEach((q, i) => {
      const input = q.question_text + ' ' + (answers[q.id] || '');
      const found = matchKeyword(input, chapterText);
      if (found) {
        perQuestion[i + 1] = found;
      }
    });

    setFeedback(perQuestion);
    setOverallInsight('📘 Feedback based on book content only. No AI used.');
  };

  const goToChapter = (newChapter) => {
    if (newChapter >= 1 && newChapter <= 21) {
      navigate(`/questions/${newChapter}`);
    }
  };

  if (loading) return <p className="p-4">📘 Loading questions...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">📘 Questions for Chapter {chapterNum}</h1>

      {questions.map((q, index) => (
        <div key={q.id} className="mb-4">
          <p className="font-semibold">
            {index + 1}. {q.question_text}
          </p>
          <textarea
            className="w-full border rounded p-2 mt-1"
            rows={3}
            value={answers[q.id] || ''}
            onChange={(e) => handleInputChange(q.id, e.target.value)}
          />
          {feedback[index + 1] && (
            <div className="text-sm text-gray-700 mt-1 whitespace-pre-line bg-gray-50 p-2 rounded border">
              💬 {feedback[index + 1]}
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-3 items-center flex-wrap mt-4">
        <button onClick={saveAllAnswers} className="border px-4 py-2 rounded bg-white hover:bg-gray-100">
          💾 Save All
        </button>
        <button onClick={generateOfflineInsights} className="border px-4 py-2 rounded bg-white hover:bg-gray-100">
          📘 Chapter-Based Feedback
        </button>
        <button onClick={() => goToChapter(chapterNum - 1)} className="ml-auto text-blue-600 hover:underline">
          ⬅️ Previous Chapter
        </button>
        <button onClick={() => goToChapter(chapterNum + 1)} className="text-blue-600 hover:underline">
          Next Chapter ➡️
        </button>
        <select
          value={chapterNum}
          onChange={(e) => goToChapter(parseInt(e.target.value))}
          className="ml-4 border p-2 rounded text-sm"
        >
          {[...Array(21)].map((_, i) => (
            <option key={i} value={i + 1}>
              Go to Chapter {i + 1}
            </option>
          ))}
        </select>
      </div>

      {overallInsight && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">🔍 Overall Insight:</h2>
          <p className="mt-1">{overallInsight}</p>
        </div>
      )}
    </div>
  );
}

export default Questions;
