import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

const data = [{name: 'Mon', h: 4}, {name: 'Tue', h: 7}, {name: 'Wed', h: 5}, {name: 'Thu', h: 8}];

export default function Analytics() {
  return (
    <div className="p-4">
      <h3 className="fw-bold mb-4">Study Analytics</h3>
      <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
        <h6 className="fw-bold mb-4 text-muted">Weekly Study Hours</h6>
        <div style={{width: '100%', height: 300}}>
          <ResponsiveContainer><BarChart data={data}><XAxis dataKey="name" /><Tooltip /><Bar dataKey="h" fill="#8b5cf6" radius={5} /></BarChart></ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
