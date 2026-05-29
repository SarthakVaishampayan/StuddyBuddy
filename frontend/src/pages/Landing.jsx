import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen, Brain, BarChart3, Calendar, CheckCircle2, Clock,
  Sparkles, Target, TrendingUp, Zap, Menu, X, ChevronRight,
  Star, Users, Award, GraduationCap, BookMarked, ListChecks,
  ArrowUpRight
} from 'lucide-react';

// ── ScrollReveal hook ──────────────────────────────────────────
const useScrollReveal = (threshold = 0.12) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
};

// ── Section wrapper ────────────────────────────────────────────
const Section = ({ id, className = '', children, dark }) => (
  <section id={id} className={`landing-section ${className} ${dark ? 'landing-cta' : ''}`}>
    {children}
  </section>
);

// ── Scroll-in card ─────────────────────────────────────────────
const AnimateIn = ({ children, className = '', delay = 0 }) => {
  const [ref, visible] = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={`${className} ${visible ? 'visible' : ''}`}
      style={{
        opacity: 0,
        transform: 'translateY(30px)',
        transition: `all 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}s`,
        ...(visible ? { opacity: 1, transform: 'translateY(0)' } : {}),
      }}
    >
      {children}
    </div>
  );
};

// ── Landing Navbar ─────────────────────────────────────────────
const LandingNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container d-flex align-items-center justify-content-between">
        <a href="#" className="landing-nav-brand">
          <div
            className="d-flex align-items-center justify-content-center rounded-2"
            style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
          >
            <BookOpen size={18} color="white" />
          </div>
          StudyBuddy
        </a>

        {/* Desktop links */}
        <ul className="landing-nav-links d-none d-md-flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="d-flex align-items-center gap-2">
          <button
            className="d-none d-md-inline-flex btn btn-sm fw-semibold"
            style={{
              color: 'rgba(255,255,255,0.65)',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '0.45rem 1rem',
            }}
            onClick={() => navigate(user ? '/dashboard' : '/login')}
          >
            {user ? 'Dashboard' : 'Sign In'}
          </button>
          <button
            className="d-none d-md-inline-flex btn btn-sm fw-semibold landing-nav-cta"
            onClick={() => navigate('/register')}
          >
            Get Started Free
          </button>

          {/* Mobile hamburger */}
          <button
            className="btn d-md-none p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: '#fff' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="d-md-none"
          style={{
            background: 'rgba(15,23,42,0.97)',
            backdropFilter: 'blur(20px)',
            padding: '1rem 0',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="container d-flex flex-column gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '1rem' }}
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '0.5rem 0' }} />
            <button
              className="btn btn-sm fw-semibold"
              style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              onClick={() => { setMobileOpen(false); navigate(user ? '/dashboard' : '/login'); }}
            >
              {user ? 'Dashboard' : 'Sign In'}
            </button>
            <button
              className="btn btn-sm fw-semibold"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
              }}
              onClick={() => { setMobileOpen(false); navigate('/register'); }}
            >
              Get Started Free
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// ── Interactive Mockup Carousel ────────────────────────────────
const SCREENS = [
  { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={12} /> },
  { id: 'tasks',     label: 'Tasks',     icon: <ListChecks size={12} /> },
  { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={12} /> },
];

const DashboardMockup = () => (
  <div className="mock-card">
    <div className="mock-card-header">
      <span className="mock-card-title">Today's Overview</span>
      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem' }}>● ● ●</span>
    </div>
    {/* Stat tiles in a 3-col row */}
    <div className="mock-row" style={{ marginBottom: '0.6rem' }}>
      <div>
        <div className="mock-stat-value">3.2</div>
        <div className="mock-stat-label">Hours Studied</div>
        <div className="mock-progress"><div className="mock-progress-bar" style={{ width: '64%' }} /></div>
      </div>
      <div>
        <div className="mock-stat-value">15</div>
        <div className="mock-stat-label">Tasks Done</div>
        <div className="mock-progress"><div className="mock-progress-bar green" style={{ width: '75%' }} /></div>
      </div>
      <div>
        <div className="mock-stat-value">7</div>
        <div className="mock-stat-label">Day Streak</div>
        <div className="mock-progress"><div className="mock-progress-bar amber" style={{ width: '40%' }} /></div>
      </div>
    </div>
    {/* Habit rows */}
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.5rem' }}>
      <div className="mock-card-title" style={{ marginBottom: '0.3rem' }}>Today's Habits</div>
      <div className="mock-habit">
        <span className="mock-habit-emoji">📚</span>
        <span className="mock-habit-name">Read textbook</span>
        <div className="mock-habit-dots">
          {[1,2,3,4,5,6,7].map(i => <div key={i} className={`mock-habit-dot ${i <= 5 ? 'filled' : ''}`} />)}
        </div>
      </div>
      <div className="mock-habit">
        <span className="mock-habit-emoji">🧠</span>
        <span className="mock-habit-name">Review notes</span>
        <div className="mock-habit-dots">
          {[1,2,3,4,5,6,7].map(i => <div key={i} className={`mock-habit-dot filled green ${i <= 3 ? 'green' : ''}`} />)}
        </div>
      </div>
      <div className="mock-habit">
        <span className="mock-habit-emoji">🏋️</span>
        <span className="mock-habit-name">Exercise</span>
        <div className="mock-habit-dots">
          {[1,2,3,4,5,6,7].map(i => <div key={i} className={`mock-habit-dot filled amber ${i <= 2 ? 'amber' : ''}`} />)}
        </div>
      </div>
    </div>
  </div>
);

const TasksMockup = () => (
  <>
    <div className="mock-card" style={{ marginBottom: '0.5rem' }}>
      <div className="mock-card-header">
        <span className="mock-card-title">Today's Tasks</span>
        <span style={{ color: 'rgba(139,92,246,0.4)', fontSize: '0.65rem', fontWeight: 600 }}>4 remaining</span>
      </div>
      <div className="mock-task">
        <div className="mock-task-check done">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
        </div>
        <span className="mock-task-text done">Finish math homework</span>
        <span className="mock-task-priority high">High</span>
      </div>
      <div className="mock-task">
        <div className="mock-task-check done">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
        </div>
        <span className="mock-task-text done">Read chapter 5</span>
        <span className="mock-task-priority low">Low</span>
      </div>
      <div className="mock-task">
        <div className="mock-task-check" />
        <span className="mock-task-text">Prepare physics presentation</span>
        <span className="mock-task-priority med">Med</span>
      </div>
      <div className="mock-task">
        <div className="mock-task-check" />
        <span className="mock-task-text">Submit lab report</span>
        <span className="mock-task-priority high">High</span>
      </div>
    </div>
    <div className="mock-card">
      <div className="mock-card-title" style={{ marginBottom: '0.3rem' }}>Upcoming</div>
      <div className="mock-task">
        <div className="mock-task-check" />
        <span className="mock-task-text" style={{ color: 'rgba(255,255,255,0.35)' }}>Group project meeting</span>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem' }}>Tomorrow</span>
      </div>
    </div>
  </>
);

const AnalyticsMockup = () => (
  <>
    <div className="mock-card" style={{ marginBottom: '0.5rem' }}>
      <div className="mock-card-header">
        <span className="mock-card-title">Weekly Study Hours</span>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem' }}>+12% vs last week</span>
      </div>
      <div className="mock-chart">
        {[35, 55, 40, 75, 60, 90, 80].map((h, i) => (
          <div key={i} className={`mock-chart-bar ${['purple','indigo','green','amber','pink','cyan','purple'][i]}`} style={{ height: `${h * 0.75}px` }} />
        ))}
      </div>
      <div className="mock-row" style={{ marginTop: '0.3rem', justifyContent: 'space-between' }}>
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
          <span key={d} style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.55rem', textAlign: 'center', flex: 1 }}>{d}</span>
        ))}
      </div>
    </div>
    <div className="mock-card">
      <div className="mock-card-title" style={{ marginBottom: '0.3rem' }}>Subjects Breakdown</div>
      <div className="mock-subject">
        <div className="mock-subject-dot" style={{ background: '#8b5cf6' }} />
        <span className="mock-subject-name">Mathematics</span>
        <span className="mock-subject-value">12.5h</span>
      </div>
      <div className="mock-subject">
        <div className="mock-subject-dot" style={{ background: '#6366f1' }} />
        <span className="mock-subject-name">Physics</span>
        <span className="mock-subject-value">8.2h</span>
      </div>
      <div className="mock-subject">
        <div className="mock-subject-dot" style={{ background: '#22c55e' }} />
        <span className="mock-subject-name">Computer Science</span>
        <span className="mock-subject-value">15.0h</span>
      </div>
    </div>
  </>
);

const InteractiveMockup = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(null);
  const activeRef = useRef(activeIdx);

  // Keep ref in sync
  useEffect(() => {
    activeRef.current = activeIdx;
  }, [activeIdx]);

  // Auto-rotate carousel (no dependency churn)
  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIdx(activeRef.current);
      setActiveIdx((prev) => (prev + 1) % SCREENS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx) => {
    if (idx === activeIdx) return;
    setPrevIdx(activeIdx);
    setActiveIdx(idx);
  };

  const screens = [
    { id: 'dashboard', component: <DashboardMockup /> },
    { id: 'tasks',     component: <TasksMockup /> },
    { id: 'analytics', component: <AnalyticsMockup /> },
  ];

  return (
    <div className="hero-mockup">
      <div className="hero-mockup-inner">
        <div className="hero-mockup-bar">
          <div className="hero-mockup-dot" />
          <div className="hero-mockup-dot" />
          <div className="hero-mockup-dot" />
        </div>

        <div className="hero-mockup-content" style={{ minHeight: '320px' }}>
          <div className="mockup-carousel">
            {screens.map((screen, idx) => (
              <div
                key={screen.id}
                className={`mockup-screen ${idx === activeIdx ? 'active' : ''} ${idx === prevIdx ? 'exit' : ''}`}
              >
                <div className="mock-screen-label">
                  {SCREENS[idx].icon}
                  <span>{SCREENS[idx].label}</span>
                </div>
                {screen.component}
              </div>
            ))}
          </div>

          {/* Carousel dots */}
          <div className="mock-carousel-dots">
            {SCREENS.map((s, idx) => (
              <button
                key={s.id}
                className={`mock-carousel-dot ${idx === activeIdx ? 'active' : ''}`}
                onClick={() => goTo(idx)}
                aria-label={`View ${s.label}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Hero Section ───────────────────────────────────────────────
const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="landing-hero position-relative">
      <div className="landing-hero-grid" />
      <div className="landing-hero-glow glow-1" />
      <div className="landing-hero-glow glow-2" />
      <div className="floating-shape floating-shape-1" />
      <div className="floating-shape floating-shape-2" />

      <div className="container position-relative" style={{ zIndex: 1, paddingTop: '100px', paddingBottom: '80px' }}>
        <div className="row align-items-center g-5">
          {/* Left content */}
          <div className="col-lg-6">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              <span>Now with AI-powered document analysis</span>
            </div>

            <h1 className="hero-title">
              Study smarter,{' '}
              <span className="hero-title-gradient">not harder.</span>
            </h1>

            <p className="hero-subtitle">
              The all-in-one student productivity platform. Track habits, manage tasks,
              analyze your marks, chat with AI about your documents, and unlock your
              full academic potential.
            </p>

            <div className="hero-cta">
              <button
                className="btn btn-hero-primary"
                onClick={() => navigate(user ? '/dashboard' : '/register')}
              >
                {user ? 'Go to Dashboard' : 'Get Started Free'}
                <ChevronRight size={18} className="ms-1" />
              </button>
              <button
                className="btn btn-hero-secondary"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Features
              </button>
            </div>

            {/* Stats */}
            <div className="hero-stats-row">
              <div className="hero-stat">
                <div className="hero-stat-value">12+</div>
                <div className="hero-stat-label">Smart Tools</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">2K+</div>
                <div className="hero-stat-label">Active Students</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">97%</div>
                <div className="hero-stat-label">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right mockup — interactive carousel */}
          <div className="col-lg-6">
            <InteractiveMockup />
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Features Data ──────────────────────────────────────────────
const FEATURES = [
  {
    icon: <BarChart3 size={22} />,
    title: 'Analytics Dashboard',
    desc: 'Beautiful charts and insights on your study habits, marks trends, streaks, and weekly performance — all in one glance.',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)',
  },
  {
    icon: <Brain size={22} />,
    title: 'AI Document Assistant',
    desc: 'Upload PDFs and PPTs, then chat with our AI to summarize, quiz yourself, or clarify any concept instantly.',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.1)',
  },
  {
    icon: <ListChecks size={22} />,
    title: 'Smart Task Manager',
    desc: 'Organize tasks with priority levels (low/medium/high), due dates, and one-click toggling. Never miss an assignment.',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
  },
  {
    icon: <Target size={22} />,
    title: 'Daily Habit Tracker',
    desc: 'Build consistent study habits with visual calendars, streak tracking, and customizable habit cards with emojis.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
  },
  {
    icon: <Clock size={22} />,
    title: 'Study Timer & Goals',
    desc: 'Pomodoro-style timer with daily goals. Log your sessions automatically and watch your weekly progress grow.',
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.1)',
  },
  {
    icon: <BookMarked size={22} />,
    title: 'Subjects & Marks',
    desc: 'Organize subjects with topics, save marks per exam, and visually track your academic performance over time.',
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.1)',
  },
  {
    icon: <Calendar size={22} />,
    title: 'Global Calendar',
    desc: 'See all your tasks, reminders, habits, and study sessions on a single unified calendar view with daily breakdowns.',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)',
  },
  {
    icon: <GraduationCap size={22} />,
    title: 'Study Progress',
    desc: 'Track your total study time, daily goals, and weekly trends with beautiful progress rings and streak badges.',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.1)',
  },
  {
    icon: <BookOpen size={22} />,
    title: 'Your Space',
    desc: 'A personal dashboard for your saved links, quick notes, uploads, and bookmarks — all organized in one place.',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
  },
];

// ── Features Section ───────────────────────────────────────────
const Features = () => {
  const [ref, visible] = useScrollReveal(0.05);

  return (
    <Section id="features">
      <div className="container" ref={ref}>
        <div className="text-center mb-5" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.5s ease' }}>
          <div className="section-label">
            <Sparkles size={14} />
            Features
          </div>
          <h2 className="section-title">Everything you need to excel</h2>
          <p className="section-subtitle mx-auto">
            From AI-powered document analysis to smart habit tracking — StudyBuddy has every tool a modern student needs.
          </p>
        </div>

        <div className="row g-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="col-md-6 col-lg-4">
              <AnimateIn delay={i * 0.04}>
                <div className="feature-card h-100">
                  <div className="feature-icon" style={{ background: f.bg, color: f.color }}>
                    {f.icon}
                  </div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </AnimateIn>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ── How It Works ───────────────────────────────────────────────
const HowItWorks = () => {
  const [ref, visible] = useScrollReveal(0.08);
  const steps = [
    { num: 1, title: 'Create your free account', desc: 'Sign up in seconds — no credit card required. Set up your profile and subjects.' },
    { num: 2, title: 'Set up your study tools', desc: 'Add your habits, tasks, subjects, and upload your study documents for AI analysis.' },
    { num: 3, title: 'Track & improve daily', desc: 'Use the timer, log sessions, check analytics, and chat with AI to stay on top of your work.' },
  ];

  return (
    <Section id="how-it-works" className="bg-body-tertiary" style={{ background: 'var(--bg-subtle)' }}>
      <div className="container" ref={ref}>
        <div className="text-center mb-5" style={{ opacity: visible ? 1 : 0, transition: 'all 0.5s ease' }}>
          <div className="section-label">
            <Zap size={14} />
            How It Works
          </div>
          <h2 className="section-title">Start in 3 simple steps</h2>
          <p className="section-subtitle mx-auto">
            Get up and running in under 2 minutes. No setup headaches, no configuration needed.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {steps.map((s, i) => (
            <div key={i} className="col-md-4">
              <AnimateIn delay={i * 0.15}>
                <div className="step-card">
                  <div className="step-number">{s.num}</div>
                  {i < steps.length - 1 && <div className="step-connector" />}
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc">{s.desc}</p>
                </div>
              </AnimateIn>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ── Testimonials ───────────────────────────────────────────────
const Testimonials = () => {
  const [ref, visible] = useScrollReveal(0.08);
  const testimonials = [
    {
      avatar: 'A', name: 'Aisha M.', role: 'Computer Science, Stanford',
      text: 'StudyBuddy completely changed how I organize my semester. The AI document Q&A alone saved me hours of re-reading lecture notes.',
    },
    {
      avatar: 'R', name: 'Rohan K.', role: 'Pre-Med, UCLA',
      text: 'The habit tracker + study timer combo is incredible. I went from 2 hours/day to consistently 5+ hours of focused studying.',
    },
    {
      avatar: 'S', name: 'Sarah L.', role: 'Engineering, MIT',
      text: 'I love how everything is in one place — tasks, marks, calendar, and subjects. No more juggling 5 different apps.',
    },
  ];

  return (
    <Section id="testimonials">
      <div className="container" ref={ref}>
        <div className="text-center mb-5" style={{ opacity: visible ? 1 : 0, transition: 'all 0.5s ease' }}>
          <div className="section-label">
            <Star size={14} />
            Testimonials
          </div>
          <h2 className="section-title">Loved by students worldwide</h2>
          <p className="section-subtitle mx-auto">
            Join thousands of students who have transformed their study habits with StudyBuddy.
          </p>
        </div>

        <div className="row g-4">
          {testimonials.map((t, i) => (
            <div key={i} className="col-md-4">
              <AnimateIn delay={i * 0.12}>
                <div className="testimonial-card h-100">
                  <div className="testimonial-stars">
                    {'★★★★★'}
                  </div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.avatar}</div>
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ── Pricing ────────────────────────────────────────────────────
const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ref, visible] = useScrollReveal(0.05);

  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: '/month',
      desc: 'Perfect for getting started with core study tools.',
      features: [
        'Task & habit tracking',
        'Basic analytics dashboard',
        'Study timer & daily goals',
        'Subject & marks tracking',
        'Up to 5 document uploads',
      ],
      popular: false,
      cta: 'Get Started Free',
      action: () => navigate('/register'),
    },
    {
      name: 'Pro',
      price: '$4.99',
      period: '/month',
      desc: 'For serious students who want AI-powered studying.',
      features: [
        'Everything in Starter',
        'Unlimited AI document Q&A',
        'Advanced analytics & trends',
        'Priority AI response time',
        'Unlimited document uploads',
        'Custom study reminders',
        'Export data (CSV/PDF)',
      ],
      popular: true,
      cta: 'Start Free Trial',
      action: () => navigate('/register'),
    },
    {
      name: 'Lifetime',
      price: '$49',
      period: ' one-time',
      desc: 'One payment, lifetime access. Best value for serious students.',
      features: [
        'Everything in Pro',
        'All future Pro features',
        'Priority email support',
        'Early access to new tools',
        'Custom branding (coming soon)',
      ],
      popular: false,
      cta: 'Get Lifetime Access',
      action: () => navigate('/register'),
    },
  ];

  return (
    <Section id="pricing">
      <div className="container" ref={ref}>
        <div className="text-center mb-5" style={{ opacity: visible ? 1 : 0, transition: 'all 0.5s ease' }}>
          <div className="section-label">
            <Sparkles size={14} />
            Pricing
          </div>
          <h2 className="section-title">Simple, transparent pricing</h2>
          <p className="section-subtitle mx-auto">
            Start free, upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>

        <div className="row g-4 justify-content-center align-items-stretch">
          {plans.map((p, i) => (
            <div key={i} className="col-md-4">
              <AnimateIn delay={i * 0.12}>
                <div className={`pricing-card h-100 d-flex flex-column ${p.popular ? 'pricing-card-popular' : ''}`}>
                  {p.popular && <div className="pricing-popular-badge">Most Popular</div>}
                  <div className="pricing-name">{p.name}</div>
                  <div className="pricing-price">
                    {p.price}<span>{p.period}</span>
                  </div>
                  <p className="pricing-desc">{p.desc}</p>
                  <ul className="pricing-features flex-grow-1">
                    {p.features.map((f, j) => (
                      <li key={j}>
                        <i className="fa-solid fa-check" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`btn w-100 fw-bold py-2`}
                    style={{
                      borderRadius: 12,
                      ...(p.popular
                        ? { background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff', border: 'none', boxShadow: '0 4px 15px rgba(139,92,246,0.3)' }
                        : { background: 'var(--bg-subtle)', color: 'var(--text-primary)', border: '1px solid var(--border-light)' }),
                    }}
                    onClick={p.action}
                  >
                    {p.cta}
                  </button>
                </div>
              </AnimateIn>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ── Stats Counter ──────────────────────────────────────────────
const StatsCounter = () => {
  const [ref, visible] = useScrollReveal(0.2);

  const stats = [
    { icon: <Users size={28} />, value: '2,000+', label: 'Active Students' },
    { icon: <Clock size={28} />, value: '50K+', label: 'Study Hours Logged' },
    { icon: <CheckCircle2 size={28} />, value: '10K+', label: 'Tasks Completed' },
    { icon: <Award size={28} />, value: '97%', label: 'Satisfaction Rate' },
  ];

  return (
    <div ref={ref} className="py-4" style={{
      background: 'linear-gradient(135deg, var(--purple-600), var(--indigo-600))',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.6s ease',
    }}>
      <div className="container">
        <div className="row text-center g-3">
          {stats.map((s, i) => (
            <div key={i} className="col-6 col-lg-3 py-3">
              <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Final CTA ──────────────────────────────────────────────────
const FinalCTA = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ref, visible] = useScrollReveal(0.15);

  return (
    <Section dark>
      <div className="landing-cta-content container text-center py-5" ref={ref}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(25px)',
          transition: 'all 0.6s ease',
        }}
      >
        <div
          className="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-1 mb-4"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#a78bfa', fontSize: '0.85rem' }}
        >
          <Sparkles size={14} />
          <span>Start Free — No Credit Card Needed</span>
        </div>

        <h2 className="mb-3">Ready to transform your study habits?</h2>
        <p className="mx-auto mb-4" style={{ maxWidth: 500 }}>
          Join thousands of students who are already studying smarter with AI-powered tools, habit tracking, and analytics.
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button
            className="btn btn-hero-primary"
            onClick={() => navigate(user ? '/dashboard' : '/register')}
            style={{ fontSize: '1.05rem', padding: '0.9rem 2.2rem' }}
          >
            {user ? 'Go to Dashboard' : 'Get Started Free'}
            <ArrowUpRight size={18} className="ms-1" />
          </button>
          <button
            className="btn btn-hero-secondary"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </button>
        </div>
      </div>
    </Section>
  );
};

// ── Footer ─────────────────────────────────────────────────────
const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="landing-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="landing-footer-brand">StudyBuddy</div>
            <p className="landing-footer-desc">
              The AI-powered student productivity platform. Study smarter, track better, achieve more.
            </p>
          </div>
          <div className="col-md-2">
            <h6 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.85rem' }}>Product</h6>
            <ul className="landing-footer-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
            </ul>
          </div>
          <div className="col-md-2">
            <h6 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.85rem' }}>Company</h6>
            <ul className="landing-footer-links">
              <li><a href="/about">About Us</a></li>
              <li><a href="/about">Contact</a></li>
              <li><a href="/about">Support</a></li>
            </ul>
          </div>
          <div className="col-md-2">
            <h6 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.85rem' }}>Legal</h6>
            <ul className="landing-footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          <div className="col-md-2">
            <h6 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.85rem' }}>Connect</h6>
            <ul className="landing-footer-links">
              <li><a href="https://github.com/SarthakVaishampayan" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="/about">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="landing-footer-bottom">
          &copy; {year} StudyBuddy. Built with ❤️ by Sarthak Vaishampayan. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

// ── Main Landing Page ──────────────────────────────────────────
const Landing = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-page">
      <LandingNav />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <StatsCounter />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Landing;
