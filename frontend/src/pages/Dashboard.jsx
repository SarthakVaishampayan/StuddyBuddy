import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MoreHorizontal, Play, Pause, Check, RotateCcw, Save } from 'lucide-react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const initialHabits = [
  { id: 1, name: 'Exercise', streak: 12, today: true },
  { id: 2, name: 'Reading', streak: 8, today: false },
  { id: 3, name: 'Water Intake', streak: 45, today: true },
  { id: 4, name: '8h Sleep', streak: 3, today: false },
];

const barData = [
  { name: 'Sun', hours: 4 }, { name: 'Mon', hours: 6 }, { name: 'Tue', hours: 4.5 },
  { name: 'Wed', hours: 7 }, { name: 'Thu', hours: 3.8 }, { name: 'Fri', hours: 5 }, { name: 'Sat', hours: 8 },
];

const pieData = [{ name: 'Completed', value: 85 }, { name: 'Pending', value: 15 }];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [habits, setHabits] = useState(initialHabits);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  
  const [studyStats, setStudyStats] = useState({ today: 4.2, week: 25.5, yesterday: 3.2 });
  const [todos] = useState([
    { id: 1, text: 'Complete React Assignment', completed: false },
    { id: 2, text: 'Review Database Concepts', completed: true },
  ]);

  useEffect(() => {
    let interval;
    if (timerRunning) interval = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimerAction = () => {
    if (timerRunning) {
      setTimerRunning(false);
      setShowLogDialog(true);
    } else setTimerRunning(true);
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, today: !h.today, streak: h.today ? h.streak - 1 : h.streak + 1 } : h));
  };

  const remainingTasks = todos.filter(t => !t.completed).length;

  return (
    <div className="p-4">
      {/* Welcome Header */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark">Hello, {user?.name?.split(' ')[0] || 'User'}!</h3>
        <p className="text-muted">You have {remainingTasks} tasks pending for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="bg-white p-4 rounded-4 shadow-sm border cursor-pointer hover-shadow h-100" onClick={() => navigate('/todo')}>
            <h6 className="fw-bold text-muted small mb-3 uppercase">Tasks Pending</h6>
            <h2 className="fw-bold mb-1">{remainingTasks}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
            <h6 className="fw-bold text-muted small mb-3 uppercase">Study Today</h6>
            <h2 className="fw-bold mb-1">{studyStats.today}h</h2>
            <p className="small text-success mb-0">+12% vs yesterday</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
            <h6 className="fw-bold text-muted small mb-3 uppercase">Weekly Total</h6>
            <h2 className="fw-bold mb-1">{studyStats.week}h</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="bg-white p-4 text-center rounded-4 shadow-sm border h-100 d-flex flex-column justify-content-center">
            <h6 className="fw-bold text-muted mb-2 uppercase small">Current Session</h6>
            <div className="h3 fw-bold text-primary mb-3 font-monospace">{formatTime(elapsedTime)}</div>
            <div className="d-flex justify-content-center">
              <button className={`btn rounded-circle d-flex align-items-center justify-content-center shadow-sm ${timerRunning ? 'btn-danger' : 'btn-primary'}`} 
                onClick={handleTimerAction} style={{ width: '50px', height: '50px' }}>
                {timerRunning ? <Pause size={20} /> : <Play size={20} className="ms-1" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="bg-white p-4 rounded-4 shadow-sm border">
            <div className="d-flex justify-content-between mb-4">
              <h6 className="fw-bold">Study Activity</h6>
              <MoreHorizontal size={20} className="text-muted cursor-pointer" />
            </div>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
            <h6 className="fw-bold mb-4">Task Completion</h6>
            <div className="position-relative" style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    <Cell fill="#8b5cf6" /><Cell fill="#f1f5f9" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="position-absolute top-50 start-50 translate-middle text-center">
                <h4 className="fw-bold mb-0">85%</h4>
                <p className="text-muted x-small mb-0">Goals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Habits Section */}
      <div className="bg-white p-4 rounded-4 shadow-sm border">
        <h6 className="fw-bold mb-4">Habit Tracker</h6>
        <div className="row g-3">
          {habits.map(habit => (
            <div key={habit.id} className="col-md-3">
              <div className="p-3 border rounded-3 bg-light text-center">
                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-bold small">{habit.name}</span>
                  <button className={`btn btn-sm rounded-circle p-0 ${habit.today ? 'btn-success' : 'btn-outline-secondary'}`} style={{width: '24px', height: '24px'}} onClick={() => toggleHabit(habit.id)}>
                    <Check size={14} />
                  </button>
                </div>
                <div className="h3 fw-bold mb-0 text-primary">{habit.streak}d</div>
                <p className="text-muted small uppercase mb-0">Streak</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timer Log Overlay */}
      {showLogDialog && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 z-2000 d-flex align-items-center justify-content-center p-4" style={{ backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-4 p-5 text-center shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
            <div className="display-5 fw-bold text-primary mb-2 font-monospace">{formatTime(elapsedTime)}</div>
            <h5 className="fw-bold mb-4">Log this session?</h5>
            <div className="d-grid gap-2">
              <button className="btn btn-primary py-2 rounded-3" onClick={() => {setShowLogDialog(false); setElapsedTime(0);}}>
                <Save size={18} className="me-2" /> Save Session
              </button>
              <button className="btn btn-outline-secondary py-2 rounded-3" onClick={() => {setShowLogDialog(false); setElapsedTime(0);}}>
                <RotateCcw size={18} className="me-2" /> Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
