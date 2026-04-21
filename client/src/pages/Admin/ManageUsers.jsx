import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiUserPlus, FiShield, FiUser, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await api.put(`/users/${editingId}`, formData);
        alert("User updated successfully");
      } else {
        await api.post('/users', formData);
      }
      resetForm();
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} user`);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user) => {
    setIsEditMode(true);
    setEditingId(user._id);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to permanently delete this user?")) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', role: 'student' });
    setShowForm(false);
    setIsEditMode(false);
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Users</h1>
          <p className="mt-2 text-slate-500 font-medium text-lg">Manage platform access and roles.</p>
        </div>
        <button 
          onClick={() => showForm ? resetForm() : setShowForm(true)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold flex items-center hover:bg-indigo-700 active:bg-indigo-800 transition shadow-md shadow-indigo-200"
        >
          {showForm ? <><FiX className="mr-2 text-xl" /> Cancel Input</> : <><FiUserPlus className="mr-2 text-xl" /> Create User</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 mb-10 max-w-2xl transform transition-all">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">{isEditMode ? 'Edit Account Params' : 'New Account'}</h2>
          <form onSubmit={handleCreateOrUpdate} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input required type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{isEditMode ? 'New Password (Optional)' : 'Temporary Password'}</label>
              <input required={!isEditMode} type="password" placeholder={isEditMode ? "Leave blank to ignore" : ""} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Assign Role</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div className="flex space-x-3 pt-2">
              {isEditMode && <button type="button" onClick={resetForm} className="w-1/3 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition">Discard</button>}
              <button type="submit" disabled={loading} className={`${isEditMode ? 'w-2/3' : 'w-full'} py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-200 mt-2`}>{loading ? 'Applying...' : (isEditMode ? 'Update Account' : 'Create Account')}</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User Profile</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Privilege Role</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                       {u.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-slate-900">{u.name}</div>
                      <div className="text-sm text-slate-500 hidden md:block">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${u.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {u.approved ? 'Active' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium capitalize">
                  {u.role === 'admin' ? <span className="flex items-center text-purple-600"><FiShield className="mr-1" /> Admin</span> : u.role === 'teacher' ? <span className="flex items-center text-blue-600"><FiUser className="mr-1" /> Teacher</span> : 'Student'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right flex justify-end space-x-3">
                  <button onClick={() => startEdit(u)} className="p-2 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition" title="Edit User">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDelete(u._id)} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition" title="Delete User">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="p-8 text-center text-slate-500">No organizational users found.</div>}
      </div>
    </div>
  );
}
