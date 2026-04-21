import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FiPlus, FiBook, FiUsers, FiEdit2, FiTrash2, FiX, FiSettings } from 'react-icons/fi';

export default function TeacherManageCourses() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data.filter(c => c.teacherId?._id === user._id || c.teacherId === user._id));
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '' });
    setShowForm(false);
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await api.put(`/courses/${editingId}`, formData);
      } else {
        await api.post('/courses', formData);
      }
      resetForm();
      fetchCourses();
    } catch (error) {
      alert(`Failed to ${isEditMode ? 'update' : 'create'} course`);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (course) => {
    setIsEditMode(true);
    setEditingId(course._id);
    setFormData({ title: course.title, description: course.description });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to permanently delete this course and all its content?")) {
      try {
        await api.delete(`/courses/${id}`);
        fetchCourses();
      } catch (err) {
        alert("Failed to delete course");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Courses</h1>
          <p className="mt-2 text-slate-500 font-medium text-lg">Create and govern your subjects globally.</p>
        </div>
        <button 
          onClick={() => showForm ? resetForm() : setShowForm(true)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold flex items-center hover:bg-indigo-700 active:bg-indigo-800 transition shadow-md shadow-indigo-200"
        >
          {showForm ? <><FiX className="mr-2 text-xl" /> Back to Dashboard</> : <><FiPlus className="mr-2 text-xl" /> Create Course</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 mb-10 max-w-2xl transform transition-all">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">{isEditMode ? 'Edit Course Subject' : 'Course Outline'}</h2>
          <form onSubmit={handleCreateOrUpdate} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Course Title</label>
              <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" placeholder="e.g. Advanced Database Systems" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" rows="4" placeholder="Course overview and objectives..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>
            <div className="flex space-x-3 pt-2">
              {isEditMode && <button type="button" onClick={resetForm} className="w-1/3 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition">Discard</button>}
              <button type="submit" disabled={loading} className={`${isEditMode ? 'w-2/3' : 'w-full'} py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-200 mt-2`}>{loading ? 'Saving...' : (isEditMode ? 'Update Course' : 'Publish Course')}</button>
            </div>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col hover:shadow-xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-5">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-transform group-hover:scale-110">
                <FiBook />
              </div>
              <div className="flex space-x-2">
                <button onClick={() => startEdit(course)} className="p-2.5 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition" title="Edit Content">
                  <FiEdit2 />
                </button>
                <button onClick={() => handleDelete(course._id)} className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition" title="Delete Course">
                  <FiTrash2 />
                </button>
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 leading-tight">{course.title}</h2>
            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed flex-grow">{course.description}</p>
            <div className="mt-6 pt-5 border-t border-slate-100 flex justify-between items-center text-sm">
              <span className="flex items-center text-slate-600 font-semibold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <FiUsers className="mr-2 text-indigo-500" /> {course.students?.length || 0} Enrolled
              </span>
              <Link to={`/courses/${course._id}`} className="flex items-center text-indigo-600 font-bold hover:text-indigo-800 transition px-2 py-1 bg-indigo-50 hover:bg-indigo-100 rounded-lg">
                <FiSettings className="mr-1.5" /> Enter Module
              </Link>
            </div>
          </div>
        ))}
        {courses.length === 0 && !showForm && (
          <div className="col-span-3 bg-white p-16 text-center rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
             <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center text-4xl mb-4">
               <FiBook />
             </div>
             <p className="text-slate-500 text-lg font-medium mb-5">Your curriculum is completely empty.</p>
             <button onClick={() => setShowForm(true)} className="px-6 py-2.5 bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-100 transition rounded-xl">Create your initial subject</button>
          </div>
        )}
      </div>
    </div>
  );
}
