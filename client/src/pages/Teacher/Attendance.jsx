import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { FiCheckCircle, FiClock, FiShield } from 'react-icons/fi';

export default function TeacherAttendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get('/courses').then(res => {
      const myCourses = res.data.filter(c => c.teacherId?._id === user._id || c.teacherId === user._id);
      setCourses(myCourses);
      if (myCourses.length > 0) handleSelectCourse(myCourses[0]._id);
    });
  }, [user]);

  const handleSelectCourse = async (courseId) => {
    setSelectedCourse(courseId);
    try {
      const res = await api.get(`/attendance/${courseId}`);
      setAttendanceRecords(res.data.sort((a,b) => new Date(b.date) - new Date(a.date)));
    } catch(err) {
      console.error(err);
    }
  };

  const verifyRecord = async (id) => {
    try {
      await api.put(`/attendance/${id}/verify`);
      setAttendanceRecords(attendanceRecords.map(r => r._id === id ? { ...r, verified: true } : r));
    } catch(err) {
      alert("Verification operation failed on the backend");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Subject Verification</h1>
        <p className="mt-2 text-slate-500 font-medium text-lg">Approve course attendance logs directly from enrolled students.</p>
      </div>
      
      <div className="flex space-x-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
        {courses.map(c => (
          <button 
            key={c._id} 
            onClick={() => handleSelectCourse(c._id)}
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-200 ${selectedCourse === c._id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:-translate-y-0.5'}`}
          >
            {c.title}
          </button>
        ))}
        {courses.length === 0 && <span className="text-slate-500 font-medium">Create a course to begin tracking attendance.</span>}
      </div>

      {selectedCourse && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {attendanceRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <FiClock className="text-2xl text-slate-400" />
              </div>
              <p className="text-center text-slate-500 font-medium text-lg">No daily records have been submitted by students yet.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-widest">Date Logged</th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-widest">Student Profile</th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-widest">Automated Status</th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-widest">Security Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {attendanceRecords.map(record => (
                   <tr key={record._id} className="hover:bg-slate-50 transition-colors duration-150">
                     <td className="px-6 py-5 text-sm whitespace-nowrap font-medium text-slate-600">
                       {new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                     </td>
                     <td className="px-6 py-5 whitespace-nowrap">
                        <span className="font-bold text-slate-900">{record.studentId?.name || 'Unregistered Identifier'}</span>
                        <p className="text-xs text-slate-400 mt-0.5">{record.studentId?.email}</p>
                     </td>
                     <td className="px-6 py-5 whitespace-nowrap capitalize text-sm">
                       <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${record.status === 'present' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                         {record.status}
                       </span>
                     </td>
                     <td className="px-6 py-5 whitespace-nowrap">
                       {record.verified ? (
                         <span className="flex items-center text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg w-min">
                           <FiCheckCircle className="mr-1.5 text-lg" /> Validated
                         </span>
                       ) : (
                         <button onClick={() => verifyRecord(record._id)} className="flex items-center bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl border border-indigo-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all font-bold text-sm shadow-sm">
                           <FiShield className="mr-1.5" /> Authenticate
                         </button>
                       )}
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
