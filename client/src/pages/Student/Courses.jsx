import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { FiBookOpen, FiCheck } from 'react-icons/fi';

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const enroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      alert("Successfully enrolled!");
      fetchCourses();
    } catch (error) {
      alert(error.response?.data?.message || "Enrollment failed");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading courses...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Course Catalog</h1>
        <p className="mt-2 text-slate-500 font-medium text-lg">Browse and enroll in available courses.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const isEnrolled = course.students.includes(user._id);

          return (
            <div key={course._id} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-inner transition-transform group-hover:scale-110">
                <FiBookOpen />
              </div>
              <h2 className="text-xl font-bold text-slate-800">{course.title}</h2>
              <p className="text-slate-500 mt-2 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">{course.description}</p>
              
              <div className="mt-auto pt-5 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-medium mb-4 flex items-center">
                   <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center mr-2">👤</span>
                   {course.teacherId?.name || "External Instructor"}
                </p>
                {isEnrolled ? (
                  <button className="w-full py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl flex items-center justify-center pointer-events-none shadow-sm">
                    <FiCheck className="mr-2 text-lg" /> Enrolled
                  </button>
                ) : (
                  <button 
                    onClick={() => enroll(course._id)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl transition shadow-md shadow-indigo-200"
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {courses.length === 0 && (
          <div className="col-span-3 bg-white p-12 text-center rounded-3xl border border-slate-100 shadow-sm">
             <p className="text-slate-500 text-lg font-medium">No courses are available on the platform yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
