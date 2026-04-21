import { FiUsers, FiActivity, FiCalendar, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [timing, setTiming] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen && courses.length === 0) {
      api.get('/courses').then(res => setCourses(res.data)).catch(console.error);
    }
  }, [isModalOpen, courses.length]);

  const handleSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/courses/${selectedCourse}/schedule`, { timing });
      alert('Lecture Scheduled! Teacher notified directly.');
      setIsModalOpen(false);
      setTiming('');
      setSelectedCourse('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to schedule lecture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200">
           <h3 className="text-2xl font-bold mb-2">System Analytics</h3>
           <p className="text-slate-300 text-sm mb-6">Overview of platform health and usage.</p>
           <button onClick={() => alert('System Analytics module is slated for V2 deployment.')} className="bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-bold w-full hover:bg-white/20 transition active:scale-95 flex items-center justify-center">
             <FiActivity className="mr-2 text-lg" /> View Report
           </button>
        </div>
        
        <div className="rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 p-8 flex flex-col justify-center items-center text-center bg-white hover:-translate-y-1">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 bg-blue-50 text-blue-600">
            <FiUsers />
          </div>
          <h3 className="text-xl font-bold text-slate-800">User Management</h3>
          <p className="text-slate-500 text-sm mt-2 font-medium">Approve teachers</p>
          <Link to="/admin/users" className="mt-6 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-all border border-slate-200 w-full active:scale-95 inline-block text-center">
            Manage Users
          </Link>
        </div>

        <div className="rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 p-8 flex flex-col justify-center items-center text-center bg-white hover:-translate-y-1">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 bg-amber-50 text-amber-600">
            <FiCalendar />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Lecture Scheduler</h3>
          <p className="text-slate-500 text-sm mt-2 font-medium">Notify Instructors</p>
          <button onClick={() => setIsModalOpen(true)} className="mt-6 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-all border border-slate-200 w-full active:scale-95">
            Schedule Lecture
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition">
              <FiX className="text-2xl" />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Schedule Lecture</h2>
            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Course & Teacher</label>
                <select required value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-600 focus:outline-none">
                  <option value="">-- Choose Course --</option>
                  {courses.map(c => (
                    <option key={c._id} value={c._id}>{c.title} (Instructor: {c.teacherId?.name || 'Unknown'})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Timing</label>
                <input required type="datetime-local" value={timing} onChange={(e) => setTiming(e.target.value)} className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-600 focus:outline-none" />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition active:scale-95 mt-4 disabled:opacity-70">
                {loading ? 'Dispatching...' : 'Schedule & Notify'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
