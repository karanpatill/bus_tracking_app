import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import {
  MapPin, Users, Bus, Bell, PlusCircle,
  Video, TrendingUp, Activity, Clock,
  ArrowUpRight, Search, RefreshCw, ArrowRight,
  BarChart3, Wifi, Shield,
} from 'lucide-react';
import axios from '../api';
import { adminLogout } from '../api';

const AdminDashboard = () => {
  const navigate      = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    axios.get('/api/admin/me', { withCredentials: true })
      .then(r => setAdminEmail(r.data?.email || ''))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try { await adminLogout(); navigate('/login'); window.location.reload(); }
    catch (_e) { /* noop */ }
  };

  const greeting = () => {
    const h = now.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    { label: 'Registered Buses',  value: '12', sub: '8 currently active',     icon: Bus,       color: 'blue'   },
    { label: 'Students Enrolled', value: '847',sub: 'RFID cards issued',       icon: Users,     color: 'green'  },
    { label: 'Active Routes',     value: '8',  sub: 'All routes operational',  icon: MapPin,    color: 'purple' },
    { label: 'Unread Alerts',     value: '3',  sub: 'Requires your attention', icon: Bell,      color: 'amber'  },
  ];

  const recentActivity = [
    { busId: 'BUS-01', driver: 'Rajesh Kumar',  route: 'Campus — Kasaba Bawda',     status: 'Active',  speed: '48 km/h', students: 32, time: '2m ago' },
    { busId: 'BUS-02', driver: 'Sunil Patil',   route: 'Campus — Kolhapur Station', status: 'Active',  speed: '52 km/h', students: 27, time: '5m ago' },
    { busId: 'BUS-03', driver: 'Anil Shinde',   route: 'Campus — Shirol',           status: 'Offline', speed: '—',       students: 0,  time: '14m ago' },
    { busId: 'BUS-04', driver: 'Ravi Desai',    route: 'Campus — Jaysingpur',       status: 'Active',  speed: '45 km/h', students: 19, time: '1m ago' },
    { busId: 'BUS-05', driver: 'Mohan Jadhav',  route: 'Campus — Ichalkaranji',     status: 'Active',  speed: '60 km/h', students: 24, time: '3m ago' },
  ];

  const quickActions = [
    { label: 'Live Tracking',  icon: MapPin,    path: '/buslocation',  desc: 'Real-time GPS map' },
    { label: 'Attendance',     icon: Users,     path: '/attendance',   desc: 'Student boarding records' },
    { label: 'Student Lookup', icon: Activity,  path: '/student-logs', desc: 'Search by RFID card' },
    { label: 'Fleet Alerts',   icon: Bell,      path: '/api/alerts',   desc: 'Incidents & events', badge: 3 },
    { label: 'Add New Bus',    icon: PlusCircle,path: '/addbus',       desc: 'Register a vehicle' },
    { label: 'Camera Feeds',   icon: Video,     path: '/live-streams', desc: 'Onboard live video' },
  ];

  const systemHealth = [
    { label: 'GPS Tracking',   ok: true,  icon: Wifi },
    { label: 'RFID Scanners',  ok: true,  icon: Shield },
    { label: 'Alert Engine',   ok: true,  icon: Bell },
    { label: 'Analytics',      ok: true,  icon: BarChart3 },
  ];

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} adminEmail={adminEmail} />

      <div className="main-content">

        {/* ── Topbar ── */}
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-greeting">{greeting()}, Administrator</div>
            <div className="topbar-subtitle">
              {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-search">
              <Search size={13} color="var(--t4)" />
              <input type="text" placeholder="Search buses, students…" />
            </div>
            <div className="topbar-icon-btn" onClick={() => navigate('/api/alerts')} title="Fleet Alerts">
              <Bell size={15} />
              <span className="topbar-notif-badge">3</span>
            </div>
            <div className="topbar-icon-btn" title="Refresh data" onClick={() => window.location.reload()}>
              <RefreshCw size={15} />
            </div>
            <div className="topbar-avatar" title={adminEmail}>
              {adminEmail ? adminEmail[0].toUpperCase() : 'A'}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="page-container animate-fade-in-up">

          {/* Page header */}
          <div className="page-header">
            <h1 className="page-title">Fleet Management Dashboard</h1>
            <p className="page-subtitle">
              D.Y. Patil Education Society — Monitoring {stats[0].value} buses across {stats[2].value} routes serving {stats[1].value} students
            </p>
          </div>

          {/* ── KPI Stats ── */}
          <div className="stats-grid">
            {stats.map(({ label, value, sub, icon: Icon, color }) => (
              <div className={`stat-card ${color}`} key={label}>
                <div className="stat-card-header">
                  <div className="stat-card-title">{label}</div>
                  <div className={`stat-card-icon ${color}`}>
                    <Icon size={16} />
                  </div>
                </div>
                <div className="stat-card-value">{value}</div>
                <div className="stat-card-trend">{sub}</div>
              </div>
            ))}
          </div>

          {/* ── Main content grid ── */}
          <div className="grid-60-40" style={{ alignItems: 'start' }}>

            {/* Fleet Activity Table */}
            <div className="glass-card" style={{ padding: 0 }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>Live Fleet Activity</div>
                  <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>
                    Updated every 30 seconds &nbsp;·&nbsp;
                    <span style={{ color: 'var(--green)', fontWeight: 600 }}>
                      {recentActivity.filter(r => r.status === 'Active').length} active
                    </span>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/buslocation')}>
                  View Map <ArrowUpRight size={13} />
                </button>
              </div>

              <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Bus</th>
                      <th>Driver</th>
                      <th>Route</th>
                      <th>Speed</th>
                      <th>Students</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map(bus => (
                      <tr key={bus.busId}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--brand)', fontSize: 13 }}>{bus.busId}</div>
                          <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 1 }}>{bus.time}</div>
                        </td>
                        <td style={{ fontWeight: 500, color: 'var(--t1)' }}>{bus.driver}</td>
                        <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12.5, color: 'var(--t3)' }}>
                          {bus.route}
                        </td>
                        <td style={{ fontSize: 13, fontWeight: 600, color: bus.status === 'Active' ? 'var(--t1)' : 'var(--t4)' }}>
                          {bus.speed}
                        </td>
                        <td>
                          {bus.status === 'Active' ? (
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>{bus.students}</span>
                          ) : (
                            <span style={{ fontSize: 13, color: 'var(--t4)' }}>—</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${bus.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                            {bus.status === 'Active' && (
                              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                            )}
                            {bus.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', background: 'var(--surface-2)', borderRadius: '0 0 12px 12px' }}>
                <button
                  onClick={() => navigate('/attendance')}
                  style={{ fontSize: 13, color: 'var(--brand)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  View full attendance records <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Quick Actions */}
              <div className="glass-card" style={{ padding: 0 }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>Quick Actions</div>
                </div>
                <div style={{ padding: '8px' }}>
                  {quickActions.map(({ label, icon: Icon, path, desc, badge }) => (
                    <div
                      key={path}
                      onClick={() => navigate(path)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 10px', borderRadius: 8, cursor: 'pointer',
                        transition: 'background 0.12s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div className="stat-card-icon blue" style={{ width: 30, height: 30, flexShrink: 0 }}>
                        <Icon size={14} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {label}
                          {badge && <span className="sidebar-nav-badge" style={{ fontSize: 9.5 }}>{badge}</span>}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>{desc}</div>
                      </div>
                      <ArrowRight size={13} color="var(--t4)" style={{ flexShrink: 0 }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* System Health */}
              <div className="glass-card" style={{ padding: 0 }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>System Health</div>
                  <span className="badge badge-active">All Systems Go</span>
                </div>
                <div style={{ padding: '6px 8px 8px' }}>
                  {systemHealth.map(({ label, ok, icon: Icon }) => (
                    <div
                      key={label}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8 }}
                    >
                      <div className={`stat-card-icon ${ok ? 'green' : 'red'}`} style={{ width: 28, height: 28, flexShrink: 0 }}>
                        <Icon size={13} />
                      </div>
                      <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>{label}</div>
                      <span className={`badge ${ok ? 'badge-active' : 'badge-error'}`} style={{ fontSize: 11 }}>
                        {ok ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Status bar ── */}
          <div className="status-bar" style={{ marginTop: 20 }}>
            <div className="status-bar-item">
              <span className="pulse-dot" />
              <span style={{ fontWeight: 600, color: 'var(--green)' }}>All systems operational</span>
            </div>
            <div className="status-bar-item"><Bus size={12} /> 12 buses registered</div>
            <div className="status-bar-item"><Users size={12} /> 847 students tracked</div>
            <div className="status-bar-item"><MapPin size={12} /> 8 routes active</div>
            <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--t4)' }}>
              D.Y. Patil Education Society, Kolhapur, Maharashtra
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
