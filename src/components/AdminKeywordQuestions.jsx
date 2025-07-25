// קובץ מלא: AdminKeywordQuestions.jsx
// כולל שורת חיפוש, סינון לפי מילות מפתח, ייצוא CSV, ייבוא CSV

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function AdminKeywordQuestions() {
  const [questions, setQuestions] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [search, setSearch] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [form, setForm] = useState({
    question: "",
    chapter: "",
    keywordIds: [],
    is_active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: questionsData } = await supabase.from("questions").select("*").order("created_at", { ascending: false });
    const { data: keywordsData } = await supabase.from("keywords").select("*");
    const { data: links } = await supabase.from("keywords_questions").select("*");

    const enriched = (questionsData || []).map((q) => {
      const linked = (links || []).filter((l) => l.question_id === q.id);
      return {
        ...q,
        keywordIds: linked.map((l) => l.keyword_id),
      };
    });

    setQuestions(enriched);
    setKeywords(keywordsData || []);
    setLoading(false);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const newVal = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newVal }));
  }

  function handleKeywordSelect(e) {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setForm((prev) => ({ ...prev, keywordIds: selected }));
  }

  function startEdit(q) {
    setEditingId(q.id);
    setForm({
      question: q.question || "",
      chapter: q.chapter ?? "",
      keywordIds: Array.isArray(q.keywordIds) ? q.keywordIds : [],
      is_active: q.is_active ?? true,
    });
  }

  async function handleDelete(id) {
    await supabase.from("keywords_questions").delete().eq("question_id", id);
    await supabase.from("questions").delete().eq("id", id);
    fetchData();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let questionId = editingId;

    if (editingId) {
      await supabase.from("questions").update({
        question: form.question,
        chapter: form.chapter,
        is_active: form.is_active,
      }).eq("id", editingId);
    } else {
      const { data } = await supabase.from("questions").insert({
        question: form.question,
        chapter: form.chapter,
        is_active: form.is_active,
      }).select().single();
      if (data) questionId = data.id;
    }

    await supabase.from("keywords_questions").delete().eq("question_id", questionId);

    for (const keyword_id of form.keywordIds) {
      await supabase.from("keywords_questions").insert({ keyword_id, question_id: questionId });
    }

    setForm({ question: "", chapter: "", keywordIds: [], is_active: true });
    setEditingId(null);
    fetchData();
  }

  function exportToCSV() {
    const headers = ["question", "chapter", "is_active", "keywords"];
    const rows = questions.map(q => ({
      question: q.question,
      chapter: q.chapter,
      is_active: q.is_active,
      keywords: (q.keywordIds || []).map(id => keywords.find(k => k.id === id)?.name || "").join(", ")
    }));

    const csvContent = [headers.join(","), ...rows.map(row => headers.map(h => `"${row[h]}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "questions_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleImportCSV(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const rows = text.split("\n").slice(1).filter(r => r.trim() !== "");
      for (const row of rows) {
        const [question, chapter, is_active, keywordsCSV] = row.split(",").map(c => c.replace(/\"/g, "").trim());
        const { data: inserted } = await supabase.from("questions").insert({ question, chapter, is_active: is_active === "true" }).select().single();
        const keywordNames = keywordsCSV.split(",").map(k => k.trim());
        for (const name of keywordNames) {
          const keyword = keywords.find(k => k.name.toLowerCase() === name.toLowerCase());
          if (keyword) {
            await supabase.from("keywords_questions").insert({ keyword_id: keyword.id, question_id: inserted.id });
          }
        }
      }
      fetchData();
    };
    reader.readAsText(file);
  }

  const filtered = questions.filter(q => {
    const text = `${q.question} ${q.chapter}`.toLowerCase();
    const matchSearch = text.includes(search.toLowerCase());
    const matchKeyword = filterKeyword
      ? q.keywordIds?.includes(filterKeyword)
      : true;
    return matchSearch && matchKeyword;
  });

  if (loading) return <div className="p-6 text-gray-500">Loading questions...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🔑 Keyword-Based Questions</h2>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <select
          value={filterKeyword}
          onChange={e => setFilterKeyword(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Keywords</option>
          {keywords.map(k => (
            <option key={k.id} value={k.id}>{k.name}</option>
          ))}
        </select>
        <button onClick={exportToCSV} className="bg-green-600 text-white px-4 py-2 rounded">📤 Export</button>
        <label className="cursor-pointer text-blue-600 underline">
          📥 Import
          <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg mb-6 shadow bg-white">
        <input name="question" value={form.question} onChange={handleChange} placeholder="Enter question" className="w-full p-2 border rounded" required />
        <input name="chapter" value={form.chapter} onChange={handleChange} placeholder="Chapter (e.g., 11.10)" className="w-full p-2 border rounded" />
        <select multiple value={form.keywordIds} onChange={handleKeywordSelect} className="w-full p-2 border rounded h-32">
          {keywords.map((k) => (
            <option key={k.id} value={k.id}>{k.name}</option>
          ))}
        </select>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
          <span>Active</span>
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Add"} Question
        </button>
      </form>

      <table className="min-w-full border table-auto text-sm bg-white shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Question</th>
            <th className="p-2 border">Chapter</th>
            <th className="p-2 border">Keywords</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((q) => {
            const missingKeywords = (q.keywordIds || []).length === 0;
            return (
              <tr key={q.id} className="border-t hover:bg-gray-50">
                <td className="p-2 border">{q.question} {missingKeywords && <span className="text-red-500 ml-1">❗</span>}</td>
                <td className="p-2 border">{q.chapter || "-"}</td>
                <td className="p-2 border text-xs">{(q.keywordIds || []).map((id) => keywords.find((k) => k.id === id)?.name || "").join(", ")}</td>
                <td className="p-2 border text-center">{q.is_active ? "✅" : "❌"}</td>
                <td className="p-2 border space-x-2">
                  <button onClick={() => startEdit(q)} className="text-blue-500">✏️</button>
                  <button onClick={() => handleDelete(q.id)} className="text-red-500">🗑️</button>
                  {missingKeywords && (
                    <button onClick={() => startEdit(q)} className="text-orange-600 text-xs ml-1 underline">🔗 Assign Keywords</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AdminKeywordQuestions;
