import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function AdminQuestions() {
  const [questions, setQuestions] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editedQuestion, setEditedQuestion] = useState({})
  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    question_type: '',
    chapter: ''
  })

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('chapter_questions')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error('❌ Error fetching questions:', error.message)
      } else {
        setQuestions(data)
      }
    }

    fetchData()
  }, [])

  const handleEdit = (question) => {
    setEditingId(question.id)
    setEditedQuestion({ ...question })
  }

  const handleSave = async () => {
    const { error } = await supabase
      .from('chapter_questions')
      .update(editedQuestion)
      .eq('id', editingId)

    if (error) {
      console.error('❌ Error saving question:', error.message)
    } else {
      const updated = questions.map(q => q.id === editingId ? editedQuestion : q)
      setQuestions(updated)
      setEditingId(null)
      setEditedQuestion({})
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('chapter_questions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Error deleting question:', error.message)
    } else {
      setQuestions(questions.filter(q => q.id !== id))
    }
  }

  const handleChange = (field, value) => {
    setEditedQuestion(prev => ({ ...prev, [field]: value }))
  }

  const handleNewChange = (field, value) => {
    setNewQuestion(prev => ({ ...prev, [field]: value }))
  }

  const handleAdd = async () => {
    const { data, error } = await supabase
      .from('chapter_questions')
      .insert([newQuestion])

    if (error) {
      console.error('❌ Error adding question:', error.message)
    } else {
      setQuestions([...questions, ...data])
      setNewQuestion({ question_text: '', question_type: '', chapter: '' })
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📘 Chapter-Based Questions</h1>

      <table className="min-w-full border border-gray-300 shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">#</th>
            <th className="border px-3 py-2 text-left">Question</th>
            <th className="border px-3 py-2 text-left">Type</th>
            <th className="border px-3 py-2 text-left">Chapter</th>
            <th className="border px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Row to Add New Question */}
          <tr className="bg-yellow-50">
            <td className="border px-3 py-2 text-gray-400">+</td>
            <td className="border px-3 py-2">
              <input
                className="border px-2 py-1 w-full"
                value={newQuestion.question_text}
                onChange={(e) => handleNewChange('question_text', e.target.value)}
                placeholder="New question text"
              />
            </td>
            <td className="border px-3 py-2">
              <input
                className="border px-2 py-1"
                value={newQuestion.question_type}
                onChange={(e) => handleNewChange('question_type', e.target.value)}
                placeholder="e.g. Open"
              />
            </td>
            <td className="border px-3 py-2">
              <input
                className="border px-2 py-1"
                value={newQuestion.chapter}
                onChange={(e) => handleNewChange('chapter', e.target.value)}
                placeholder="e.g. Chapter 4 – Pricing"
              />
            </td>
            <td className="border px-3 py-2">
              <button
                onClick={handleAdd}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Add
              </button>
            </td>
          </tr>

          {/* Existing Questions */}
          {questions.map((q) => (
            <tr key={q.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{q.id}</td>
              <td className="border px-3 py-2">
                {editingId === q.id ? (
                  <input
                    className="border px-2 py-1 w-full"
                    value={editedQuestion.question_text}
                    onChange={(e) => handleChange('question_text', e.target.value)}
                  />
                ) : (
                  q.question_text
                )}
              </td>
              <td className="border px-3 py-2">
                {editingId === q.id ? (
                  <input
                    className="border px-2 py-1"
                    value={editedQuestion.question_type}
                    onChange={(e) => handleChange('question_type', e.target.value)}
                  />
                ) : (
                  q.question_type
                )}
              </td>
              <td className="border px-3 py-2">
                {editingId === q.id ? (
                  <input
                    className="border px-2 py-1"
                    value={editedQuestion.chapter}
                    onChange={(e) => handleChange('chapter', e.target.value)}
                  />
                ) : (
                  q.chapter
                )}
              </td>
              <td className="border px-3 py-2 space-x-2">
                {editingId === q.id ? (
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(q)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(q.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminQuestions
