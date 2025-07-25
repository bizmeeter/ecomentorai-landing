import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function AdminUsers() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Failed to fetch users:', error.message)
      } else {
        setUsers(data)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">👥 Users</h1>

      <table className="min-w-full border border-gray-300 shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">#</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Role</th>
            <th className="border px-3 py-2">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{i + 1}</td>
              <td className="border px-3 py-2">{u.email}</td>
              <td className="border px-3 py-2">{u.role || 'user'}</td>
              <td className="border px-3 py-2">{new Date(u.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminUsers
