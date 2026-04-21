import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { useContext } from 'react';

// Components & Pages
import Navbar from './components/Navbar';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import StudentCourses from './pages/Student/Courses';
import TeacherManageCourses from './pages/Teacher/ManageCourses';
import CourseDetail from './pages/CourseDetail';
import AdminManageUsers from './pages/Admin/ManageUsers';
import StudentAttendance from './pages/Student/Attendance';
import TeacherAttendance from './pages/Teacher/Attendance';
import StudentAssignments from './pages/Student/Assignments';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

// Layout with Navbar
const Layout = ({ children }) => (
  <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/student/courses" element={<ProtectedRoute><Layout><StudentCourses /></Layout></ProtectedRoute>} />
            <Route path="/student/attendance" element={<ProtectedRoute><Layout><StudentAttendance /></Layout></ProtectedRoute>} />
            <Route path="/student/assignments" element={<ProtectedRoute><Layout><StudentAssignments /></Layout></ProtectedRoute>} />
            <Route path="/teacher/courses" element={<ProtectedRoute><Layout><TeacherManageCourses /></Layout></ProtectedRoute>} />
            <Route path="/teacher/attendance" element={<ProtectedRoute><Layout><TeacherAttendance /></Layout></ProtectedRoute>} />
            <Route path="/courses/:id" element={<ProtectedRoute><Layout><CourseDetail /></Layout></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute><Layout><AdminManageUsers /></Layout></ProtectedRoute>} />
            
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  )
}

export default App;
