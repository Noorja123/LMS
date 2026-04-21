import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { FiClock, FiCheck } from 'react-icons/fi';

export default function StudentAttendance() {
  const [courses, setCourses] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get('/courses').then(res => {
      setCourses(res.data.filter(c => c.students.includes(user._id)));
    });
  }, [user]);

  const markAttendance = async (courseId) => {
    try {
      await api.post('/attendance', {
        courseId,
        studentId: user._id,
        date: new Date().toISOString(),
        status: 'present'
      });
      alert('Attendance marked successfully! Waiting for teacher to verify.');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to mark attendance. You may have already marked it for today.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Daily Attendance</h1>
        <p className="mt-2 text-slate-500 font-medium text-lg">Mark your presence for active courses today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course._id} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg border border-slate-100 flex flex-col justify-between transition-all group">
            <div>
               <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-inner transition-transform group-hover:scale-110">
                 <FiClock />
               </div>
               <h3 className="font-bold text-xl text-slate-800 leading-tight">{course.title}</h3>
               <p className="text-slate-500 text-sm mt-2 mb-6 font-medium">Verify your enrollment presence automatically on the backend records.</p>
            </div>
            <button onClick={() => markAttendance(course._id)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl flex justify-center items-center shadow-md shadow-indigo-200 transition">
              <FiCheck className="mr-2 text-lg" /> Check In
            </button>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="col-span-3 bg-white p-12 text-center rounded-3xl border border-slate-100 shadow-sm">
             <p className="text-slate-500 text-lg font-medium">You are not actively enrolled in any courses to mark attendance for.</p>
          </div>
        )}
      </div>
    </div>
  );
}
