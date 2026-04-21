import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { FiVideo, FiFile, FiPlus, FiUploadCloud, FiCheck, FiX, FiDownload } from 'react-icons/fi';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('lectures');
  const [lectures, setLectures] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const isTeacher = user.role === 'teacher';

  const [showCreateAsg, setShowCreateAsg] = useState(false);
  const [asgData, setAsgData] = useState({ title: '', description: '', dueDate: '' });

  const [showSubmitModal, setShowSubmitModal] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  
  const [showGradeModal, setShowGradeModal] = useState(null);
  const [currentSubmissions, setCurrentSubmissions] = useState([]);
  const [gradingData, setGradingData] = useState({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id, activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'lectures') {
        const res = await api.get(`/lectures/${id}`);
        setLectures(res.data);
      } else {
        const res = await api.get(`/assignments/${id}`);
        setAssignments(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/assignments/${id}`, asgData);
      setShowCreateAsg(false);
      setAsgData({ title: '', description: '', dueDate: '' });
      fetchData();
    } catch (err) {
      alert("Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if(!uploadFile) return alert("Please select a file to upload");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await api.post(`/submissions/${showSubmitModal}`, { fileUrl: uploadRes.data.fileUrl });
      alert("Assignment submitted successfully!");
      setShowSubmitModal(null);
      setUploadFile(null);
    } catch(err) {
      alert("Failed to submit assignment. Ensure it wasn't already successfully logged natively on backend.");
    } finally {
      setLoading(false);
    }
  };

  const openGradeModal = async (assignmentId) => {
    setShowGradeModal(assignmentId);
    try {
      const res = await api.get(`/submissions/${assignmentId}`);
      setCurrentSubmissions(res.data);
      const initGrading = {};
      res.data.forEach(s => {
        initGrading[s._id] = { marks: s.marks || 0, feedback: s.feedback || '' };
      });
      setGradingData(initGrading);
    } catch(err) {
      console.error(err);
    }
  };

  const submitGrade = async (subId) => {
    try {
      await api.put(`/submissions/${subId}/grade`, {
        marks: Number(gradingData[subId].marks),
        feedback: gradingData[subId].feedback
      });
      alert("Grade saved successfully");
    } catch(err) {
      alert("Failed to save grade");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex border-b border-slate-200 mb-10 overflow-x-auto">
        <button 
          className={`py-4 px-8 font-bold whitespace-nowrap transition-all flex border-b-2 items-center ${activeTab === 'lectures' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-800'}`} 
          onClick={() => setActiveTab('lectures')}
        >
          <FiVideo className="mr-2 text-lg" /> Lectures Content
        </button>
        <button 
          className={`py-4 px-8 font-bold whitespace-nowrap transition-all flex border-b-2 items-center ${activeTab === 'assignments' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-800'}`} 
          onClick={() => setActiveTab('assignments')}
        >
          <FiFile className="mr-2 text-lg" /> Assessments
        </button>
      </div>

      {activeTab === 'lectures' && (
        <div className="animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Course Lectures</h2>
            {isTeacher && <button className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-2.5 rounded-xl flex items-center font-bold shadow-md shadow-indigo-200 transition"><FiPlus className="mr-2 text-lg" /> Upload Lecture</button>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {lectures.map(l => (
               <div key={l._id} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-lg border border-slate-100 flex items-center transition-all group">
                 <div className="w-14 h-14 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-2xl mr-5 shrink-0 transition-transform group-hover:scale-110">
                   <FiVideo className="text-2xl" />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg text-slate-800 leading-tight">{l.title}</h3>
                   <div className="flex space-x-4 mt-2">
                     {l.videoUrl ? <a href={l.videoUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-indigo-600 hover:underline">Watch Video</a> : <span className="text-sm text-slate-400">No media attached</span>}
                   </div>
                 </div>
               </div>
             ))}
             {lectures.length === 0 && (
               <div className="col-span-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-500 font-medium flex flex-col items-center">
                 <FiVideo className="text-4xl text-slate-300 mb-3" />
                 <p>No lectures have been published yet.</p>
               </div>
             )}
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="animate-in fade-in duration-300 relative">
           <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Assignments</h2>
            {isTeacher && <button onClick={() => setShowCreateAsg(!showCreateAsg)} className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-2.5 rounded-xl flex items-center font-bold shadow-md shadow-indigo-200 transition">{showCreateAsg ? "Cancel Options" : <><FiPlus className="mr-2 text-lg" /> Create Assignment</>}</button>}
          </div>

          {showCreateAsg && (
            <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 mb-10 max-w-2xl transform transition-all">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">New Question Setup</h2>
              <form onSubmit={handleCreateAssignment} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Assignment Title</label>
                  <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={asgData.title} onChange={e => setAsgData({...asgData, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Task Description</label>
                  <textarea required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" rows="3" value={asgData.description} onChange={e => setAsgData({...asgData, description: e.target.value})}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Due Date</label>
                  <input required type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={asgData.dueDate} onChange={e => setAsgData({...asgData, dueDate: e.target.value})} />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition mt-2">{loading ? "Pushing..." : "Publish Task"}</button>
              </form>
            </div>
          )}

          <div className="space-y-4">
             {assignments.map(a => (
               <div key={a._id} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-lg border border-slate-100 flex flex-col md:flex-row md:items-center justify-between transition-all group">
                 <div className="flex items-center mb-4 md:mb-0">
                   <div className="w-14 h-14 bg-purple-50 text-purple-600 flex items-center justify-center rounded-2xl mr-5 shrink-0 transition-transform group-hover:scale-110">
                     <FiFile className="text-2xl" />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg text-slate-800">{a.title}</h3>
                     <p className="text-slate-500 text-sm font-medium mt-1">Due: <span className="text-slate-700">{new Date(a.dueDate).toLocaleDateString()}</span></p>
                     <p className="text-slate-500 text-sm mt-1 max-w-sm lg:max-w-xl">{a.description}</p>
                   </div>
                 </div>
                 <div className="flex shrink-0">
                   {showSubmitModal === a._id ? (
                     <form onSubmit={handleFileUpload} className="flex flex-col sm:flex-row items-center gap-3">
                       <input type="file" id="pdf_upload_input" onChange={e => setUploadFile(e.target.files[0])} accept="application/pdf,.pdf" className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                       <div className="flex space-x-2">
                         <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-md">Upload PDF</button>
                         <button type="button" onClick={() => setShowSubmitModal(null)} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-200">Cancel</button>
                       </div>
                     </form>
                   ) : (
                     !isTeacher && (
                       <button onClick={() => setShowSubmitModal(a._id)} className="bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-indigo-700 px-5 py-2.5 rounded-xl font-bold transition shadow-sm flex items-center">
                         <FiUploadCloud className="mr-2" /> Upload Submission
                       </button>
                     )
                   )}
                   
                   {isTeacher && showGradeModal !== a._id && (
                     <button onClick={() => openGradeModal(a._id)} className="bg-slate-50 hover:bg-green-50 border border-slate-200 hover:border-green-200 text-green-700 px-5 py-2.5 rounded-xl font-bold transition shadow-sm">
                       Grade Responses
                     </button>
                   )}
                 </div>
               </div>
             ))}

             {/* Grading Modal Viewer */}
             {showGradeModal && (
               <div className="fixed inset-0 top-0 left-0 bg-slate-900/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                 <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
                   <button onClick={() => setShowGradeModal(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 text-2xl transition"><FiX /></button>
                   <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Evaluate Submissions</h2>
                   <p className="text-slate-500 mb-8">Review uploaded student files and grant feedback gracefully.</p>
                   
                   {currentSubmissions.length === 0 ? (
                     <div className="text-center p-10 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 font-medium">No students have uploaded their PDFs yet for this assignment.</div>
                   ) : (
                     <div className="space-y-6">
                       {currentSubmissions.map(sub => (
                         <div key={sub._id} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                           <div>
                             <h4 className="font-bold text-slate-800 text-lg">{sub.studentId?.name || "Unknown"}</h4>
                             <p className="text-slate-500 text-sm mb-4">{sub.studentId?.email}</p>
                             <a href={`http://localhost:5000${sub.fileUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-100 transition shadow-sm border border-indigo-100">
                               <FiDownload className="mr-2" /> Download Submitted PDF
                             </a>
                           </div>
                           <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                             <div className="flex items-center gap-3">
                               <label className="text-sm font-bold text-slate-700 w-20">Score:</label>
                               <input type="number" placeholder="/100" className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" value={gradingData[sub._id]?.marks} onChange={e => setGradingData({...gradingData, [sub._id]: {...gradingData[sub._id], marks: e.target.value}})} />
                             </div>
                             <div className="flex items-center gap-3">
                               <label className="text-sm font-bold text-slate-700 w-20">Feedback:</label>
                               <input type="text" placeholder="Good job..." className="flex-1 min-w-[200px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" value={gradingData[sub._id]?.feedback} onChange={e => setGradingData({...gradingData, [sub._id]: {...gradingData[sub._id], feedback: e.target.value}})} />
                             </div>
                             <button onClick={() => submitGrade(sub._id)} className="w-full mt-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-2 rounded-lg transition shadow-md flex items-center justify-center">
                               <FiCheck className="mr-2 text-lg" /> Publish Grade
                             </button>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               </div>
             )}

             {assignments.length === 0 && !showCreateAsg && (
               <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-500 font-medium flex flex-col items-center">
                 <FiFile className="text-4xl text-slate-300 mb-3" />
                 <p>No questions have been attached to this curriculum.</p>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
