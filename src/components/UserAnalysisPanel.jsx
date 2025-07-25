// File: src/components/UserAnalysisPanel.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function UserAnalysisPanel() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('users').select('id, email');
      setUsers(data || []);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;

    const fetchDetails = async () => {
      const { data: answers } = await supabase
        .from('user_answers')
        .select('*')
        .eq('user_id', selectedUserId);

      const { data: feedbackData } = await supabase
        .from('answers_feedback')
        .select('*')
        .eq('user_id', selectedUserId);

      const { data: metadataData } = await supabase
        .from('answers_metadata')
        .select('*')
        .eq('user_id', selectedUserId);

      const { data: questionData } = await supabase
        .from('keywords_questions')
        .select('*');

      setUserAnswers(answers || []);
      setFeedback(feedbackData || []);
      setMetadata(metadataData || []);
      setQuestions(questionData || []);
    };

    fetchDetails();
  }, [selectedUserId]);

  const getQuestionText = (qid) => {
    const q = questions.find((q) => q.id === qid);
    return q ? q.question : 'Unknown';
  };

  const getMetadataFor = (qid) => metadata.find((m) => m.question_id === qid);
  const getFeedbackFor = (qid, type) =>
    feedback.find((f) => f.question_id === qid && f.feedback_type === type)?.feedback_text;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🧠 User Analysis Panel</h2>

      <label className="block mb-2 font-medium">Select User:</label>
      <select
        className="mb-6 p-2 border rounded"
        onChange={(e) => setSelectedUserId(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>Select a user</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>{u.email}</option>
        ))}
      </select>

      {userAnswers.length > 0 && (
        <table className="min-w-full bg-white border mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Question</th>
              <th className="p-2 border">Answer</th>
              <th className="p-2 border">Keywords</th>
              <th className="p-2 border">Flags</th>
              <th className="p-2 border">Score</th>
              <th className="p-2 border">AI Feedback</th>
              <th className="p-2 border">Admin Feedback</th>
            </tr>
          </thead>
          <tbody>
            {userAnswers.map((a) => {
              const meta = getMetadataFor(a.question_id);
              return (
                <tr key={a.id} className="border-t">
                  <td className="p-2 border">{getQuestionText(a.question_id)}</td>
                  <td className="p-2 border text-sm text-gray-800">{a.answer_text}</td>
                  <td className="p-2 border text-xs">{meta?.keywords_detected?.join(', ')}</td>
                  <td className="p-2 border text-xs">{meta?.flags?.join(', ')}</td>
                  <td className="p-2 border text-center">{meta?.score ?? '-'}</td>
                  <td className="p-2 border text-xs">{getFeedbackFor(a.question_id, 'ai')}</td>
                  <td className="p-2 border text-xs">{getFeedbackFor(a.question_id, 'admin')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserAnalysisPanel;
