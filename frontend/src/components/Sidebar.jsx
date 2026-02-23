import {
  LayoutDashboard, BookOpen, Book,
  MessageSquare, LogOut, User,
  ChevronLeft, ChevronRight, Info, Sparkles
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Analytics', icon: <BookOpen size={20} />,        path: '/analytics' },
    { name: 'Subjects',  icon: <Book size={20} />,            path: '/subjects' },

    // NEW
    { name: 'Your Space', icon: <Sparkles size={20} />,       path: '/space' },

    { name: 'Chats',     icon: <MessageSquare size={20} />,   path: '/chats' },
  ];

  return (
    <div
      className="bg-white vh-100 border-end d-flex flex-column transition-all"
      style={{
        width: isCollapsed ? '80px' : '260px',
        transition: 'width 0.3s',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
      }}
    >
      <div className="p-3 d-flex justify-content-end">
        <button
          className="btn btn-sm btn-light rounded-circle"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div
        className={`px-4 mb-4 d-flex align-items-center gap-2 ${
          isCollapsed ? 'justify-content-center' : ''
        }`}
      >
        <div className="p-1 rounded-2" style={{ backgroundColor: '#8b5cf6' }}>
          <BookOpen color="white" size={24} />
        </div>
        {!isCollapsed && <h5 className="mb-0 fw-bold">StudyBuddy</h5>}
      </div>

      <div className="flex-grow-1 mt-2">
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            className={`d-flex align-items-center px-4 py-3 nav-link-custom
              ${location.pathname === item.path ? 'nav-link-active' : ''}
              ${isCollapsed ? 'justify-content-center px-0' : ''}
            `}
            role="button"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(item.path)}
            title={isCollapsed ? item.name : ''}
          >
            <span className={isCollapsed ? '' : 'me-3'}>{item.icon}</span>
            {!isCollapsed && <span className="fw-medium">{item.name}</span>}
          </div>
        ))}
      </div>

      <div className="p-4 border-top">
        <div
          className={`d-flex align-items-center gap-3 ${
            isCollapsed ? 'justify-content-center px-0' : ''
          }`}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/profile')}
        >
          <div className="bg-light rounded-circle p-2 border">
            <User size={20} className="text-primary" />
          </div>
          {!isCollapsed && (
            <div>
              <p className="mb-0 fw-bold small text-dark">{user?.name || 'User'}</p>
              <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>View Profile</p>
            </div>
          )}
        </div>

        <div
          className={`d-flex align-items-center gap-3 mt-3 ${
            isCollapsed ? 'justify-content-center px-0' : ''
          }`}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/about')}
          title={isCollapsed ? 'About Us' : ''}
        >
          <div className="bg-light rounded-circle p-2 border">
            <Info size={18} className="text-secondary" />
          </div>
          {!isCollapsed && (
            <div>
              <p className="mb-0 fw-bold small text-dark">About Us</p>
              <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>Developer & contact</p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div
            className="mt-3 text-danger small d-flex align-items-center gap-2"
            role="button"
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              logout();
            }}
          >
            <LogOut size={16} /> Logout
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
