import { FiBookOpen, FiClock, FiFileText } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          title="Course Catalog" 
          icon={<FiBookOpen />}
          desc="Browse available subjects" 
          color="blue"
          action="Explore Courses"
          link="/student/courses"
        />
        <DashboardCard 
          title="Assignments" 
          icon={<FiFileText />}
          desc="Check course homework" 
          color="purple"
          action="View Tasks"
          link="/student/assignments"
        />
        <DashboardCard 
          title="Attendance" 
          icon={<FiClock />}
          desc="View your presence record" 
          color="emerald"
          action="Check Attendance"
          link="/student/attendance"
        />
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start p-4 hover:bg-slate-50 rounded-2xl transition">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
               <FiBookOpen />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-slate-800">New Lecture Added: React Hooks</p>
              <p className="text-xs text-slate-500 mt-1">Course: Frontend Engineering • 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start p-4 hover:bg-slate-50 rounded-2xl transition">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
               <FiFileText />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-slate-800">Assignment Graded: Build a REST API</p>
              <p className="text-xs text-slate-500 mt-1">Course: Backend Mastery • Score: 95/100 • 1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, icon, desc, color, action, link }) {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
    emerald: 'text-emerald-600 bg-emerald-50',
  };

  return (
    <div className="rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 p-8 flex flex-col justify-center items-center text-center bg-white hover:-translate-y-1">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-inner transition-transform hover:scale-110 ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      <p className="text-slate-500 text-sm mt-2 font-medium">{desc}</p>
      <Link to={link || '#'} className="mt-6 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-all border border-slate-200 w-full active:scale-95 inline-block w-full">
        {action}
      </Link>
    </div>
  );
}
