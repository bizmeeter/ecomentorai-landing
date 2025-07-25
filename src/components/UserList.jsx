import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase.auth.admin.listUsers()
      if (error) {
        console.error('❌ Error fetching users:', error.message)
      } else {
        setUsers(data.users)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">👤 User Management</h1>

      <table className="min-w-full border border-gray-300 shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">#</th>
            <th className="border px-3 py-2 text-left">Email</th>
            <th className="border px-3 py-2 text-left">UID</th>
            <th className="border px-3 py-2 text-left">Registered</th>
            <th className="border px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{index + 1}</td>
              <td className="border px-3 py-2">{user.email}</td>
              <td className="border px-3 py-2 text-xs">{user.id}</td>
              <td className="border px-3 py-2">{new Date(user.created_at).toLocaleDateString()}</td>
              <td className="border px-3 py-2">
                <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
