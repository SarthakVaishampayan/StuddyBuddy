import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Mail, Github, Linkedin, Send, Bug, MessageSquare } from 'lucide-react';

const AboutUs = () => {
  const { user, token } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    type: 'bug',
    message: '',
  });

  // Pre-fill once from logged-in user (doesn't change existing UI anywhere else)
  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || user.name || '',
      email: prev.email || user.email || '',
    }));
  }, [user]);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      notifyError('You must be logged in to send a message.');
      return;
    }

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      notifyError('Please fill all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
          type: form.type,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        notifySuccess('Thanks! Your message has been submitted.');
        setForm((prev) => ({
          ...prev,
          subject: '',
          type: 'bug',
          message: '',
        }));
      } else {
        notifyError(data.message || 'Failed to submit message.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      notifyError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Keep Navbar consistent with your current pattern */}
      <Navbar notifications={[]} />

      <div className="p-4 px-lg-5">
        <h2 className="fw-bold mb-4 mt-3">About Us</h2>

        <div className="row g-4">
          {/* Developer details */}
          <div className="col-lg-4">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
              <h6 className="fw-bold mb-3 text-muted text-uppercase" style={{ fontSize: '11px' }}>
                Developer
              </h6>

              <div
                className="bg-primary bg-opacity-10 rounded-circle border border-primary border-opacity-25 d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '110px', height: '110px' }}
              >
                <span className="fw-bold text-primary" style={{ fontSize: '42px' }}>
                  S
                </span>
              </div>

              <h4 className="fw-bold text-center mb-1">Sarthak Vaishampayan</h4>
              <p className="text-muted small text-center mb-3">
                Full‑Stack MERN Developer · StudyBuddy Creator
              </p>

              <div className="d-flex flex-column gap-2 small">
                <div className="d-flex align-items-center gap-2">
                  <Mail size={16} className="text-secondary" />
                  <span className="text-truncate">sarthakrocks2003@example.com</span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <Github size={16} className="text-secondary" />
                  <a
                    href="https://github.com/sarthak-vaishampayan"
                    target="_blank"
                    rel="noreferrer"
                    className="small"
                  >
                    github.com/sarthak-vaishampayan
                  </a>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <Linkedin size={16} className="text-secondary" />
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="small"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              </div>

              <hr className="my-4" />

              <p className="small text-muted mb-0">
                StudyBuddy is a personal productivity web app for students to track habits, subjects,
                tasks, study sessions, goals, and analytics.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="col-lg-8">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <MessageSquare size={20} className="text-primary" />
                  Contact / Report Bug / Query
                </h5>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted" style={{ fontSize: '11px' }}>
                      NAME *
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light border-0 rounded-3"
                      value={form.name}
                      onChange={(e) => onChange('name', e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted" style={{ fontSize: '11px' }}>
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      className="form-control bg-light border-0 rounded-3"
                      value={form.email}
                      onChange={(e) => onChange('email', e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="col-md-8">
                    <label className="form-label small fw-bold text-muted" style={{ fontSize: '11px' }}>
                      SUBJECT *
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light border-0 rounded-3"
                      value={form.subject}
                      onChange={(e) => onChange('subject', e.target.value)}
                      placeholder="Short summary (e.g. Timer issue, Feature request)"
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-muted" style={{ fontSize: '11px' }}>
                      TYPE
                    </label>
                    <select
                      className="form-select bg-light border-0 rounded-3"
                      value={form.type}
                      onChange={(e) => onChange('type', e.target.value)}
                    >
                      <option value="bug">Bug</option>
                      <option value="feedback">Feedback</option>
                      <option value="question">Query</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted" style={{ fontSize: '11px' }}>
                      MESSAGE *
                    </label>
                    <textarea
                      className="form-control bg-light border-0 rounded-3"
                      rows="6"
                      value={form.message}
                      onChange={(e) => onChange('message', e.target.value)}
                      placeholder="Write your issue / query / suggestion..."
                      required
                    />
                  </div>
                </div>

                <div className="mt-4 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <Bug size={14} />
                    <span>Tip: Mention the page name and steps to reproduce.</span>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary fw-bold rounded-3 d-inline-flex align-items-center gap-2 px-4"
                    disabled={submitting}
                  >
                    <Send size={16} />
                    {submitting ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutUs;
