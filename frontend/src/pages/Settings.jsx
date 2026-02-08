import { Bell, Lock, User, Palette } from 'lucide-react';

export default function Settings() {
  const options = [
    { icon: <User size={20}/>, title: 'Account Settings', desc: 'Update your personal info' },
    { icon: <Bell size={20}/>, title: 'Notifications', desc: 'Manage alerts and reminders' },
    { icon: <Lock size={20}/>, title: 'Privacy & Security', desc: 'Password and 2FA' },
    { icon: <Palette size={20}/>, title: 'Theme Appearance', desc: 'Customize UI colors' },
  ];

  return (
    <div className="p-4">
      <h3 className="fw-bold mb-4">Settings</h3>
      <div className="row g-3">
        {options.map(opt => (
          <div className="col-md-6" key={opt.title}>
            <div className="bg-white p-4 rounded-4 shadow-sm border hover-shadow cursor-pointer transition-all">
              <div className="d-flex align-items-center gap-3">
                <div className="text-primary">{opt.icon}</div>
                <div>
                  <h6 className="fw-bold mb-0">{opt.title}</h6>
                  <small className="text-muted">{opt.desc}</small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
