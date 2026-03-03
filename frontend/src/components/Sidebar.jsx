import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Users,
  ClipboardList,
  Bell,
  PlusCircle,
  Video,
  BarChart3,
  LogOut,
  Bus,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',          icon: LayoutDashboard, path: '/' },
  { label: 'Live Tracking',      icon: MapPin,          path: '/buslocation' },
  { label: 'Attendance',         icon: Users,           path: '/attendance' },
  { label: 'Student Logs',       icon: ClipboardList,   path: '/student-logs' },
  { label: 'Alerts',             icon: Bell,            path: '/api/alerts', badge: 3 },
  { label: 'Add Bus',            icon: PlusCircle,      path: '/addbus' },
  { label: 'Live Camera',        icon: Video,           path: '/live-streams' },
  { label: 'Analytics',          icon: BarChart3,       path: '/analytics' },
];

const Sidebar = ({ onLogout, adminEmail }) => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const initial = (email) => (email ? email[0].toUpperCase() : 'A');

  return (
    <aside className="sidebar">
      {/* ── Brand header ── */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-logo">
            <Bus />
          </div>
          <div>
            <div className="sidebar-brand-name">DY Patil BMS</div>
            <div className="sidebar-brand-tagline">Bus Management System</div>
          </div>
        </div>
        <div className="sidebar-inst-tag">
          D.Y. Patil Education Society, Kolhapur
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <div
              key={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(item.path)}
            >
              <Icon className="sidebar-nav-icon" />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span className="sidebar-nav-badge">{item.badge}</span>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── User footer ── */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initial(adminEmail)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name">{adminEmail || 'Administrator'}</div>
            <div className="sidebar-user-role">System Administrator</div>
          </div>
        </div>

        {onLogout && (
          <button className="btn-logout" onClick={onLogout}>
            <LogOut size={14} />
            Sign out
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
