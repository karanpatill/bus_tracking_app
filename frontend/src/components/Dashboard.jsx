import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { adminLogout } from '../api';
import { TrendingUp, Bus, Users, Activity, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await adminLogout(); navigate('/login'); window.location.reload(); }
    catch (_e) { /* noop */ }
  };

  const weeklyData = [
    { day: 'Mon', boardings: 145, alightings: 138 },
    { day: 'Tue', boardings: 162, alightings: 155 },
    { day: 'Wed', boardings: 158, alightings: 149 },
    { day: 'Thu', boardings: 171, alightings: 168 },
    { day: 'Fri', boardings: 147, alightings: 143 },
    { day: 'Sat', boardings: 89,  alightings: 86  },
    { day: 'Sun', boardings: 42,  alightings: 40  },
  ];

  const maxVal = Math.max(...weeklyData.map(d => d.boardings));

  const routeData = [
    { route: 'Campus — Kasaba Bawda',      utilization: 92, students: 145 },
    { route: 'Campus — Kolhapur Station',  utilization: 78, students: 120 },
    { route: 'Campus — Jaysingpur',        utilization: 85, students: 132 },
    { route: 'Campus — Shirol',            utilization: 67, students: 98  },
    { route: 'Campus — Ichalkaranji',      utilization: 71, students: 108 },
  ];

  const alertSummary = [
    { type: 'Emergency',       count: 2 },
    { type: 'Speed Violation', count: 8 },
    { type: 'Geo-fence Breach',count: 5 },
    { type: 'Delay',           count: 14 },
    { type: 'Idle Engine',     count: 7 },
  ];

  const fleetOverview = [
    { label: 'Buses Registered', value: '12' },
    { label: 'Active Buses',     value: '8'  },
    { label: 'In Maintenance',   value: '2'  },
    { label: 'Inactive',         value: '2'  },
    { label: 'Students Enrolled',value: '847' },
    { label: 'Routes Covered',   value: '8'  },
  ];

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />

      <div className="main-content">

        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-greeting">Fleet Analytics</div>
            <div className="topbar-subtitle">Route performance, attendance trends &amp; fleet utilisation</div>
          </div>
          <div className="topbar-right">
            <button className="btn btn-secondary btn-sm" onClick={() => window.location.reload()}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>

        <div className="page-container animate-fade-in-up">

          {/* KPI cards */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            {[
              { label: 'Total Boardings (Week)', value: '914', sub: '+12% vs last week', icon: TrendingUp, color: 'blue'  },
              { label: 'Avg Daily Students',     value: '130', sub: 'Per route',         icon: Users,     color: 'green' },
              { label: 'Fleet Utilisation',      value: '87%', sub: 'Above target',      icon: Bus,       color: 'amber' },
              { label: 'On-Time Departure',      value: '94%', sub: 'Excellent record',  icon: Activity,  color: 'green' },
            ].map(({ label, value, sub, icon: Icon, color }) => (
              <div className={`stat-card ${color}`} key={label}>
                <div className="stat-card-header">
                  <div className="stat-card-title">{label}</div>
                  <div className={`stat-card-icon ${color}`}><Icon size={17} /></div>
                </div>
                <div className="stat-card-value">{value}</div>
                <div className="stat-card-trend" style={{ color: 'var(--green-600)' }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid-60-40">

            {/* Weekly bar chart */}
            <div className="glass-card">
              <div className="flex justify-between items-center mb-16">
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Weekly Boarding Trends</h2>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Student boardings vs alightings</p>
                </div>
                <div className="flex gap-16 text-sm" style={{ flexShrink: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span style={{ width: 10, height: 6, borderRadius: 2, background: 'var(--brand-primary)', display: 'inline-block' }} />
                    Boardings
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span style={{ width: 10, height: 6, borderRadius: 2, background: 'var(--green-600)', display: 'inline-block' }} />
                    Alightings
                  </span>
                </div>
              </div>

              {/* Bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 180 }}>
                {weeklyData.map(({ day, boardings, alightings }) => (
                  <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', width: '100%', height: 160 }}>
                      <div
                        style={{
                          flex: 1,
                          background: 'var(--brand-primary)',
                          height: `${(boardings / maxVal) * 100}%`,
                          borderRadius: '3px 3px 0 0',
                          minHeight: 3,
                          opacity: 0.85,
                        }}
                        title={`${day}: ${boardings} boardings`}
                      />
                      <div
                        style={{
                          flex: 1,
                          background: 'var(--green-600)',
                          height: `${(alightings / maxVal) * 100}%`,
                          borderRadius: '3px 3px 0 0',
                          minHeight: 3,
                          opacity: 0.75,
                        }}
                        title={`${day}: ${alightings} alightings`}
                      />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Route performance */}
            <div className="glass-card">
              <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
                Route Utilisation
              </h2>
              {routeData.map(({ route, utilization, students }) => (
                <div key={route} style={{ marginBottom: 14 }}>
                  <div className="flex justify-between items-center mb-4">
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 8 }}>
                      {route}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: utilization >= 80 ? 'var(--green-600)' : 'var(--amber-600)', flexShrink: 0 }}>
                      {utilization}%
                    </span>
                  </div>
                  <div style={{ height: 5, background: 'var(--bg-muted)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      width: `${utilization}%`,
                      height: '100%',
                      background: utilization >= 80 ? 'var(--green-600)' : 'var(--amber-600)',
                      borderRadius: 4,
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                    {students} students avg / day
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid-2" style={{ marginTop: 20 }}>

            {/* Alert summary */}
            <div className="glass-card">
              <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
                Alerts Summary — Last 30 Days
              </h2>
              {alertSummary.map(({ type, count }) => (
                <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{type}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{count}</span>
                </div>
              ))}
            </div>

            {/* Fleet overview */}
            <div className="glass-card">
              <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
                Fleet Overview
              </h2>
              {fleetOverview.map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
