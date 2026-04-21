import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiBell } from 'react-icons/fi';
import api from '../services/api';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      api.get('/notifications').then(res => {
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.isRead).length);
      }).catch(err => console.error(err));
    }
  }, [user]);

  useEffect(() => {
    if (socket && user) {
      const handler = (data) => {
        const newNotif = { _id: Date.now().toString(), message: data.message, isRead: false, createdAt: new Date().toISOString() };
        setNotifications(prev => [newNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
      };

      socket.on(`notification_${user._id}`, handler);
      
      return () => {
        socket.off(`notification_${user._id}`, handler);
      };
    }
  }, [socket, user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({...n, isRead: true})));
    } catch(err) {}
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={user ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-md shadow-indigo-200">
                <span className="text-white font-black text-xl leading-none">S</span>
              </div>
              <span className="font-extrabold text-xl text-slate-800 tracking-tight">Smart LMS</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="relative">
                  <button onClick={() => setShowDropdown(!showDropdown)} className="p-2 relative rounded-xl text-slate-500 hover:bg-slate-100 transition mt-1">
                    <FiBell className="text-xl" />
                    {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 shadow-xl rounded-2xl py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                        {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-indigo-600 font-semibold hover:underline">Mark all read</button>}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-slate-500 text-sm font-medium">No recent notifications</div>
                        ) : (
                          notifications.map(n => (
                            <div key={n._id} className={`px-4 py-3 border-b border-slate-50 text-sm transition ${!n.isRead ? 'bg-indigo-50/40' : 'hover:bg-slate-50'}`}>
                              <p className="text-slate-800 font-medium">{n.message}</p>
                              <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="hidden md:flex items-center px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold border border-indigo-100">
                  <FiUser className="mr-2" />
                  {user.name} <span className="ml-1.5 text-indigo-400 capitalize">({user.role})</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="inline-flex items-center p-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
                  title="Logout"
                >
                  <FiLogOut className="text-lg" />
                  <span className="ml-2 hidden sm:block">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-semibold px-3 py-2 text-sm transition">Log in</Link>
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition shadow-md shadow-indigo-200 shrink-0">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
