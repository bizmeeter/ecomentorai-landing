import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function OnboardingQuestions() {
  const [questions, setQuestions] = useState([])
  const [newQuestion, setNewQuestion] = useState('')
  const [newType, setNewType] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingQuestion, setEditingQuestion] = useState('')
  const [editingType, setEditingType] = useState('')

  useEffect(() => {
    fetchQuestions()
  }, [])

  async function fetchQuestions() {
    const { data, error } = await supabase.from('onboarding_questions').select('*').order('id', { ascending: true })
    if (error) console.error('❌ Error fetching questions:', error)
    else setQuestions(data)
  }

  async function addQuestion() {
    if (!newQuestion || !newType) return
    const { error } = await supabase.from('onboarding_questions').insert([{ question_text: newQuestion, question_type: newType, group: 'welcome' }])
    if (error) console.error('❌ Error adding question:', error)
    else {
      setNewQuestion('')
      setNewType('')
      fetchQuestions()
    }
  }

  async function deleteQuestion(id) {
    const { error } = await supabase.from('onboarding_questions').delete().eq('id', id)
    if (error) console.error('❌ Error deleting question:', error)
    else fetchQuestions()
  }

  async function updateQuestion(id) {
    const { error } = await supabase.from('onboarding_questions').update({
      question_text: editingQuestion,
      question_type: editingType
    }).eq('id', id)
    if (error) console.error('❌ Error updating question:', error)
    else {
      setEditingId(null)
      setEditingQuestion('')
      setEditingType('')
      fetchQuestions()
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📝 Onboarding Questions</h1>
      <table className="min-w-full border border-gray-300 shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">#</th>
            <th className="border px-3 py-2 text-left">Question</th>
            <th className="border px-3 py-2 text-left">Type</th>
            <th className="border px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-3 py-2">+</td>
            <td className="border px-3 py-2">
              <input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="New question text"
              />
            </td>
            <td className="border px-3 py-2">
              <input
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="e.g. text / select / checkbox"
              />
            </td>
            <td className="border px-3 py-2">
              <button onClick={addQuestion}>Add</button>
            </td>
          </tr>
          {questions.map((q, index) => (
            <tr key={q.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{index + 1}</td>
              <td className="border px-3 py-2">
                {editingId === q.id ? (
                  <input
                    value={editingQuestion}
                    onChange={(e) => setEditingQuestion(e.target.value)}
                  />
                ) : (
                  q.question_text
                )}
              </td>
              <td className="border px-3 py-2">
                {editingId === q.id ? (
                  <input
                    value={editingType}
                    onChange={(e) => setEditingType(e.target.value)}
                  />
                ) : (
                  q.question_type
                )}
              </td>
              <td className="border px-3 py-2 space-x-2">
                {editingId === q.id ? (
                  <>
                    <button onClick={() => updateQuestion(q.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => {
                      setEditingId(q.id)
                      setEditingQuestion(q.question_text)
                      setEditingType(q.question_type)
                    }}>Edit</button>
                    <button onClick={() => deleteQuestion(q.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OnboardingQuestions
