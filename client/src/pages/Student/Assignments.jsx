import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiFile, FiClock, FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/assignments/student/me');
      setAssignments(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Assignments</h1>
          <p className="mt-2 text-slate-500 font-medium text-lg">Track your pending homework and upcoming due dates across all enrolled subjects.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map(a => (
            <div key={a._id} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-lg border border-slate-100 flex flex-col md:flex-row md:items-center justify-between transition-all group">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 flex items-center justify-center rounded-2xl mr-5 shrink-0 transition-transform group-hover:scale-110">
                  <FiFile className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{a.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-indigo-600 font-semibold text-sm bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{a.courseId?.title || 'Unknown Course'}</span>
                    <p className="text-slate-500 font-medium text-sm flex items-center"><FiClock className="mr-1" /> Due: <span className="text-slate-700 ml-1">{new Date(a.dueDate).toLocaleDateString()}</span></p>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0">
                <Link to={`/courses/${a.courseId?._id}`} className="bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-indigo-700 px-5 py-2.5 rounded-xl font-bold transition shadow-sm flex items-center">
                  <FiSettings className="mr-2" /> Open Module to Submit
                </Link>
              </div>
            </div>
          ))}

          {assignments.length === 0 && (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center text-slate-500 font-medium flex flex-col items-center shadow-inner">
              <FiFile className="text-5xl text-slate-300 mb-4" />
              <p className="text-xl">You have no pending assignments!</p>
              <p className="mt-2 text-slate-400">Any homework pushed by your instructors will appear here dynamically.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
