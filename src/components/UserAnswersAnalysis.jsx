import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { saveAs } from 'file-saver';

function UserAnswersAnalysis() {
  const [answers, setAnswers] = useState([]);
  const [aiFeedback, setAiFeedback] = useState({});
  const [filterUser, setFilterUser] = useState('');

  useEffect(() => {
    fetchAnswers();
  }, []);

  const fetchAnswers = async () => {
    const { data: metaData, error: metaError } = await supabase.from('answers_metadata').select('*');
    const { data: aiData, error: aiError } = await supabase.from('answers_feedback').select('*');

    if (metaError || aiError) {
      console.error('Error fetching data:', metaError || aiError);
    } else {
      setAnswers(metaData);
      const aiMap = {};
      aiData.forEach((entry) => {
        aiMap[entry.question_id] = entry.feedback_text;
      });
      setAiFeedback(aiMap);
    }
  };

  const updateAnswer = async (id, updatedFields) => {
    const { error } = await supabase.from('answers_metadata').upsert({ id, ...updatedFields });
    if (error) console.error('Error updating answer:', error);
    else fetchAnswers();
  };

  const handleExport = () => {
    const headers = ['id', 'user_id', 'question_id', 'admin_feedback', 'flags', 'keywords_detected', 'needs_user_update', 'score'];
    const rows = answers.map(a => headers.map(h => a[h] ?? ''));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'answers_metadata_export.csv');
  };

  const handleFieldChange = (id, field, value) => {
    setAnswers(prev =>
      prev.map(a => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const filteredAnswers = answers.filter(a =>
    a.user_id.toLowerCase().includes(filterUser.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">🧾 User Answers Analysis</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by user_id"
          value={filterUser}
          onChange={e => setFilterUser(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          ⬇️ Export CSV
        </button>
      </div>

      <table className="min-w-full bg-white border rounded">
        <thead>
          <tr>
            <th className="border p-2">User</th>
            <th className="border p-2">Question ID</th>
            <th className="border p-2">Admin Feedback</th>
            <th className="border p-2">AI Feedback</th>
            <th className="border p-2">Flags</th>
            <th className="border p-2">Keywords</th>
            <th className="border p-2">Needs Update</th>
            <th className="border p-2">Score</th>
            <th className="border p-2">Save</th>
          </tr>
        </thead>
        <tbody>
          {filteredAnswers.map((a) => (
            <tr key={a.id}>
              <td className="border p-2">{a.user_id}</td>
              <td className="border p-2">{a.question_id}</td>
              <td className="border p-2">
                <input
                  value={a.admin_feedback || ''}
                  onChange={(e) => handleFieldChange(a.id, 'admin_feedback', e.target.value)}
                  className="border p-1 w-full"
                />
              </td>
              <td className="border p-2 text-sm text-gray-700 italic">
                {aiFeedback[a.question_id] || '–'}
              </td>
              <td className="border p-2">
                <input
                  value={a.flags || ''}
                  onChange={(e) => handleFieldChange(a.id, 'flags', e.target.value)}
                  className="border p-1 w-full"
                />
              </td>
              <td className="border p-2">
                <input
                  value={a.keywords_detected || ''}
                  onChange={(e) => handleFieldChange(a.id, 'keywords_detected', e.target.value)}
                  className="border p-1 w-full"
                />
              </td>
              <td className="border p-2">
                <input
                  type="checkbox"
                  checked={a.needs_user_update || false}
                  onChange={(e) => handleFieldChange(a.id, 'needs_user_update', e.target.checked)}
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={a.score ?? ''}
                  onChange={(e) => handleFieldChange(a.id, 'score', parseInt(e.target.value) || 0)}
                  className="border p-1 w-20"
                />
              </td>
              <td className="border p-2">
                <button
                  onClick={() => updateAnswer(a.id, a)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  💾 Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserAnswersAnalysis;
