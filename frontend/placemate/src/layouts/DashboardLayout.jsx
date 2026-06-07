import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../contexts/AuthContext';

const NAV_ICONS = {
  home: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  rooms: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  schedules: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  companies: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  students: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  logout: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
};

export default function DashboardLayout({ children, title = "Dashboard" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const role = user?.role;
  const isSuperAdmin = role === 'SUPERADMIN' || role === 'INSTITUTION';
  const isAdmin = role === 'ADMIN';
  const isStudent = role === 'STUDENT';

  const isActive = (path) => location.pathname === path;
  const userInitial = (user?.fullName || user?.name || user?.email || 'U').charAt(0).toUpperCase();

  let roleLabel = 'User';
  if (isSuperAdmin) roleLabel = 'Institution Admin';
  else if (isAdmin) roleLabel = 'College Admin';
  else if (isStudent) roleLabel = 'Student';

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">Placemate</div>
          <div className="sidebar-subtitle">{roleLabel}</div>
        </div>

        <nav className="sidebar-nav">
          {/* ── SUPERADMIN NAV ── */}
          {isSuperAdmin && (
            <>
              <span className="sidebar-section-label">Overview</span>
              <Link
                to="/admin/dashboard"
                className={`nav-link${isActive('/admin/dashboard') ? ' active' : ''}`}
              >
                {NAV_ICONS.home} Dashboard
              </Link>

              <span className="sidebar-section-label" style={{ marginTop: '0.75rem' }}>Management</span>
              <Link
                to="/admin/dashboard/rooms"
                className={`nav-link${isActive('/admin/dashboard/rooms') ? ' active' : ''}`}
              >
                {NAV_ICONS.rooms} Rooms
              </Link>
              <Link
                to="/admin/dashboard/schedules"
                className={`nav-link${isActive('/admin/dashboard/schedules') ? ' active' : ''}`}
              >
                {NAV_ICONS.schedules} Schedules
              </Link>
              <Link
                to="/admin/dashboard/companies"
                className={`nav-link${isActive('/admin/dashboard/companies') ? ' active' : ''}`}
              >
                {NAV_ICONS.companies} Companies & Rounds
              </Link>
              <Link
                to="/admin/dashboard/students"
                className={`nav-link${isActive('/admin/dashboard/students') ? ' active' : ''}`}
              >
                {NAV_ICONS.students} Students
              </Link>
            </>
          )}

          {/* ── ADMIN / STUDENT NAV ── */}
          {(isAdmin || isStudent) && (
            <>
              <span className="sidebar-section-label">Navigation</span>
              <Link
                to="/dashboard"
                className={`nav-link${isActive('/dashboard') ? ' active' : ''}`}
              >
                {NAV_ICONS.home} Home
              </Link>

              {isAdmin && (
                <>
                  <span className="sidebar-section-label" style={{ marginTop: '0.75rem' }}>Management</span>
                  <Link
                    to="/dashboard/rooms"
                    className={`nav-link${isActive('/dashboard/rooms') ? ' active' : ''}`}
                  >
                    {NAV_ICONS.rooms} Rooms
                  </Link>
                  <Link
                    to="/dashboard/schedules"
                    className={`nav-link${isActive('/dashboard/schedules') ? ' active' : ''}`}
                  >
                    {NAV_ICONS.schedules} Schedules
                  </Link>
                  <Link
                    to="/dashboard/companies"
                    className={`nav-link${isActive('/dashboard/companies') ? ' active' : ''}`}
                  >
                    {NAV_ICONS.companies} Companies & Rounds
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{userInitial}</div>
            <div style={{ minWidth: 0 }}>
              <div className="sidebar-user-name">{user?.fullName || user?.name || user?.email || 'User'}</div>
              <div className="sidebar-user-role">{roleLabel}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary w-full"
            style={{ justifyContent: 'center', gap: '0.5rem', fontSize: '0.8rem', padding: '0.6rem' }}
          >
            {NAV_ICONS.logout} Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h2 className="topbar-title">{title}</h2>
          <span className="topbar-breadcrumb">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </header>

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
