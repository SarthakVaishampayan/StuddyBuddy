// File: StudyBuddy/frontend/src/pages/Analytics.jsx
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useTimer } from '../context/TimerContext';
import { useNotification } from '../context/NotificationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

const Analytics = () => {
  const { token } = useAuth();
  const { notifyInfo } = useNotification();

  const [data, setData] = useState([]);
  const [totalSec, setTotalSec] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch reminders so Navbar can show notifications
  const [reminders, setReminders] = useState([]);

  const formatHms = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
  };

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [wRes, rRes] = await Promise.all([
        fetch('http://localhost:5000/api/sessions/weekly-stats', { headers }),
        fetch('http://localhost:5000/api/reminders', { headers }),
      ]);

      const [wData, rData] = await Promise.all([wRes.json(), rRes.json()]);

      if (wData?.success) {
        setData(wData.graphData);
        const total = wData.graphData.reduce((acc, curr) => acc + curr.rawSeconds, 0);
        setTotalSec(total);
      }

      if (rData?.success) {
        setReminders(rData.reminders);
      }
    } catch (err) {
      console.error('Analytics fetch failed:', err);
      notifyInfo('Failed to load analytics data. Try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="p-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Navbar notifications={reminders} />

      <div className="p-4 px-lg-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Study Insights</h2>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="bg-white p-4 rounded-4 border shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-2 text-primary">
                <Clock size={18} />{' '}
                <span className="small fw-bold text-uppercase">Weekly Total</span>
              </div>
              <h3 className="fw-bold text-dark">{formatHms(totalSec)}</h3>
              <p className="text-muted small mb-0">
                Total focus time logged in last 7 days
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="bg-white p-4 rounded-4 border shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-2 text-success">
                <Calendar size={18} />{' '}
                <span className="small fw-bold text-uppercase">Consistency</span>
              </div>
              <h3 className="fw-bold">
                {data.filter((d) => d.rawSeconds > 0).length} / 7 Days
              </h3>
              <p className="text-muted small mb-0">
                Days you met your study goals
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-4 border shadow-sm" style={{ minHeight: '450px' }}>
          <h6 className="fw-bold mb-4">Focus Duration Trend (Hours)</h6>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f1f1"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  height={50}
                  tick={({ x, y, payload }) => (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={0}
                        y={10}
                        dy={16}
                        textAnchor="middle"
                        fill="#111"
                        fontSize={12}
                        fontWeight="bold"
                      >
                        {payload.value}
                      </text>
                      <text
                        x={0}
                        y={28}
                        dy={16}
                        textAnchor="middle"
                        fill="#6b7280"
                        fontSize={11}
                      >
                        {data[payload.index]?.date}
                      </text>
                    </g>
                  )}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: '#f9fafb' }}
                  content={({ active, payload }) =>
                    active &&
                    payload && (
                      <div className="bg-white p-3 border rounded-3 shadow-sm small">
                        <div className="fw-bold text-dark">
                          {payload[0].payload.day}, {payload[0].payload.date}
                        </div>
                        <div className="text-primary fw-bold">
                          {formatHms(payload[0].payload.rawSeconds)}
                        </div>
                      </div>
                    )
                  }
                />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]} barSize={50}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 6 ? '#8b5cf6' : '#ddd6fe'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
