import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-indigo-100/50 w-full max-w-md border border-indigo-50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
             <FiLock className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500 mt-2 font-medium">Sign in to your Smart LMS account</p>
        </div>
        
        {error && <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl mb-6 text-sm text-center font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-slate-400" />
              </div>
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-slate-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-slate-400" />
              </div>
              <input 
                type="password" 
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-slate-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 mt-2"
          >
            Sign In
          </button>
        </form>
        
        <p className="mt-8 text-center text-slate-600 text-sm font-medium">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline decoration-2 underline-offset-2 transition-all">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
