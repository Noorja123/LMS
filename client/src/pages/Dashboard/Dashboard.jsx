import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="mt-2 text-slate-500 font-medium text-lg">Welcome back, {user.name}!</p>
      </div>

      {user.role === 'student' && <StudentDashboard />}
      {user.role === 'teacher' && <TeacherDashboard />}
      {user.role === 'admin' && <AdminDashboard />}
    </div>
  );
}
