import React, { useEffect, useState } from "react";
import { updateUsers, getAllUsers, DeleteUsers } from "../../api/api";
import { FiUser, FiMail, FiTrash2, FiShield, FiShieldOff, FiSearch, FiUsers } from "react-icons/fi";
import { toast } from "react-toastify";

function AdminUsers() {
  const [user, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("accessToken")?.replace(/^"|"$/g, '');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const res = await getAllUsers(token);
        const users = res.data.results || res.data;
        const allUsers = Array.isArray(users) ? users : [];
        setUsers(allUsers.filter((u) => u.role === "user"));
      } catch (err) {
        console.error("Fetch users error:", err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const token = getToken();
      await updateUsers(userId, { is_active: !currentStatus }, token);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u));
      toast.info(`User ${!currentStatus ? 'activated' : 'blocked'} successfully`);
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const handldelete = async (userId) => {
    if (!window.confirm("Permanent action: Delete this user account?")) return;
    try {
      const token = getToken();
      await DeleteUsers(userId, token);
      setUsers(user.filter((u) => u.id !== userId));
      toast.success("User deleted");
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  // Filter users based on search
  const filteredUsers = user.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 mt-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <FiUsers className="text-indigo-600" />
              User Management
            </h2>
            <p className="text-gray-500 mt-1">Review permissions and account statuses</p>
          </div>

          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">User Profile</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-20 text-gray-400">Syncing database...</td></tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-indigo-50/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-800">{u.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiMail className="text-gray-400" />
                          <span className="text-sm">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${
                          u.is_active 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-rose-100 text-rose-700"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full mr-2 ${u.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {u.is_active ? "Verified" : "Restricted"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleToggleStatus(u.id, u.is_active)}
                            title={u.is_active ? "Block User" : "Unblock User"}
                            className={`p-2 rounded-xl border transition-all ${
                              u.is_active 
                              ? "text-amber-600 border-amber-100 hover:bg-amber-50" 
                              : "text-emerald-600 border-emerald-100 hover:bg-emerald-50"
                            }`}
                          >
                            {u.is_active ? <FiShieldOff /> : <FiShield />}
                          </button>
                          <button
                            onClick={() => handldelete(u.id)}
                            title="Delete Account"
                            className="p-2 rounded-xl border border-rose-100 text-rose-600 hover:bg-rose-50 transition-all"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-20">
                      <div className="flex flex-col items-center text-gray-400">
                        <FiUser size={48} className="mb-2 opacity-20" />
                        <p>No matches found for "{searchTerm}"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer Stats */}
          {!loading && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing <span className="font-bold text-gray-700">{filteredUsers.length}</span> active customers
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;