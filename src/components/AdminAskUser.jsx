import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const AdminAskUser = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onboardingAnswers, setOnboardingAnswers] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);

  useEffect(() => {
    if (search.length < 2) return;

    const fetchUsers = async () => {
      const { data } = await supabase
        .from("users")
        .select("id, email, plan, user_type")
        .ilike("email", `%${search}%`);

      setUsers(data || []);
    };

    fetchUsers();
  }, [search]);

  const loadUserDetails = async (user) => {
    setSelectedUser(user);

    const { data: onboarding } = await supabase
      .from("user_onboarding_answers")
      .select("question_text, answer_text")
      .eq("user_id", user.id);

    const { data: questions } = await supabase
      .from("user_questions")
      .select("question_text, answer_text, rating, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    setOnboardingAnswers(onboarding || []);
    setUserQuestions(questions || []);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎯 Ask for User</h1>

      <input
        type="text"
        placeholder="Search by email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {users.length > 0 && (
        <ul className="mb-6">
          {users.map((u) => (
            <li
              key={u.id}
              onClick={() => loadUserDetails(u)}
              className="cursor-pointer border p-2 rounded mb-2 hover:bg-gray-100"
            >
              <strong>{u.email}</strong> ({u.user_type} / {u.plan})
            </li>
          ))}
        </ul>
      )}

      {selectedUser && (
        <div className="space-y-6">
          <div className="border p-4 rounded bg-white">
            <h2 className="text-xl font-semibold mb-2">🧾 User Brief</h2>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>User Type:</strong> {selectedUser.user_type}</p>
            <p><strong>Plan:</strong> {selectedUser.plan}</p>
          </div>

          <div className="border p-4 rounded bg-white">
            <h2 className="text-xl font-semibold mb-2">📝 Onboarding Info</h2>
            {onboardingAnswers.length > 0 ? (
              onboardingAnswers.map((a, i) => (
                <div key={i} className="mb-2">
                  <p className="font-semibold">{a.question_text}</p>
                  <p className="text-sm text-gray-700">{a.answer_text}</p>
                </div>
              ))
            ) : (
              <p>No onboarding data.</p>
            )}
          </div>

          <div className="border p-4 rounded bg-white">
            <h2 className="text-xl font-semibold mb-2">❓ Recent Questions</h2>
            {userQuestions.length > 0 ? (
              userQuestions.map((q, i) => (
                <div key={i} className="mb-4">
                  <p className="font-semibold">Q: {q.question_text}</p>
                  <p className="text-sm mb-1">A: {q.answer_text}</p>
                  <p className="text-xs text-gray-500">Rating: {q.rating || "N/A"} | {new Date(q.created_at).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p>No recent questions.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAskUser;
