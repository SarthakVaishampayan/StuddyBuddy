import { LayoutDashboard, BookOpen, CheckSquare, MessageSquare, LogOut, User, Book, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/' },
    { name: 'Analytics', icon: <BookOpen size={20}/>, path: '/analytics' },
    { name: 'Assignments', icon: <CheckSquare size={20}/>, path: '/assignments' },
    { name: 'Subjects', icon: <Book size={20}/>, path: '/subjects' },
    { name: 'Chats', icon: <MessageSquare size={20}/>, path: '/chats' },
  ];

  return (
    <div 
      className="bg-white vh-100 border-end d-flex flex-column" 
      style={{ 
        width: isCollapsed ? '80px' : '260px', 
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        position: 'sticky', 
        top: 0,
        zIndex: 1000
      }}
    >
      <div className="p-3 d-flex justify-content-end">
        <button className="btn btn-sm btn-light rounded-circle shadow-sm" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className={`px-4 mb-4 d-flex align-items-center gap-2 ${isCollapsed ? 'justify-content-center' : ''}`}>
        <div className="p-1 rounded-2 shadow-sm" style={{ backgroundColor: '#8b5cf6' }}>
          <BookOpen color="white" size={24} />
        </div>
        {!isCollapsed && <h5 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>StudyBuddy</h5>}
      </div>

      <div className="flex-grow-1 mt-2">
        {menuItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <div 
              key={idx} 
              className={`d-flex align-items-center px-4 py-3 cursor-pointer transition-all ${isActive ? 'bg-light text-primary border-end border-3 border-primary' : 'text-muted'}`} 
              role="button"
              onClick={() => navigate(item.path)}
              style={{ transition: 'all 0.2s' }}
            >
              <span className={isCollapsed ? "" : "me-3"}>{item.icon}</span>
              {!isCollapsed && <span className="fw-medium">{item.name}</span>}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-top mt-auto">
        <div className={`d-flex align-items-center gap-3 cursor-pointer ${isCollapsed ? 'justify-content-center px-0' : ''}`} onClick={() => navigate('/profile')}>
          <div className="bg-light rounded-circle p-2 border">
            <User size={20} className="text-primary" />
          </div>
          {!isCollapsed && (
            <div>
              <p className="mb-0 fw-bold small text-dark">{user?.name || 'User'}</p>
              <p className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>View Profile</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <div className="mt-3 text-danger small d-flex align-items-center gap-2 cursor-pointer fw-bold" onClick={logout}>
            <LogOut size={16} /> Logout
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
