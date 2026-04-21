import { FiPlusCircle, FiUsers, FiFileText } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
           <h3 className="text-2xl font-bold mb-2">Create Course</h3>
           <p className="text-indigo-100 text-sm mb-6">Launch a new course and share your knowledge.</p>
           <Link to="/teacher/courses" className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl text-sm font-bold w-full hover:bg-indigo-50 transition active:scale-95 flex items-center justify-center inline-block">
             <FiPlusCircle className="mr-2 text-lg" /> New Course
           </Link>
        </div>
        
        <div className="rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 p-8 flex flex-col justify-center items-center text-center bg-white hover:-translate-y-1">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-inner transition-transform hover:scale-110">
            <FiUsers />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Attendance Verification</h3>
          <p className="text-slate-500 text-sm mt-2 font-medium">Manage student records</p>
          <Link to="/teacher/attendance" className="mt-6 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-all border border-slate-200 w-full active:scale-95 text-center block">
            Monitor Subjects
          </Link>
        </div>

        <div className="rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 p-8 flex flex-col justify-center items-center text-center bg-white hover:-translate-y-1">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 bg-rose-50 text-rose-600">
            <FiFileText />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Submissions</h3>
          <p className="text-slate-500 text-sm mt-2 font-medium">Needs grading: 12</p>
          <Link to="/teacher/courses" className="mt-6 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-all border border-slate-200 w-full active:scale-95 text-center inline-block">
            Grade Now
          </Link>
        </div>
      </div>
    </div>
  );
}
