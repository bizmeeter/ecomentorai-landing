import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    let query = supabase.from("users").select("*");

    if (searchName || searchEmail) {
      if (searchName && searchEmail) {
        query = query.or(`full_name.ilike.%${searchName}%,email.ilike.%${searchEmail}%`);
      } else if (searchName) {
        query = query.ilike("full_name", `%${searchName}%`);
      } else if (searchEmail) {
        query = query.ilike("email", `%${searchEmail}%`);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } else {
      setUsers(data || []);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">👨‍💼 Users</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchUsers}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Full Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Plan</th>
            <th className="p-2">Store Type</th>
            <th className="p-2">Business Name</th>
            <th className="p-2">Audience</th>
            <th className="p-2">Target</th>
            <th className="p-2">Stage</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td className="p-2" colSpan="9">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user.full_name || "—"}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.plan || "—"}</td>
                <td className="p-2">{user.store_type || "—"}</td>
                <td className="p-2">{user.business_name || "—"}</td>
                <td className="p-2">{user.audience_profile || "—"}</td>
                <td className="p-2">{user.target_goals || "—"}</td>
                <td className="p-2">{user.onboarding_stage || "—"}</td>
                <td className="p-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => navigate(`/user-journey/${user.id}`)}
                  >
                    View Journey
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
