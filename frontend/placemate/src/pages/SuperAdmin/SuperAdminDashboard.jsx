import { useNavigate } from 'react-router-dom';
import useAuth from '../../contexts/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const NavCard = ({ icon, title, description, to, color }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(to)}
            style={{
                background: 'var(--color-surface)',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = color;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--color-border)';
            }}
        >
            <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-md)',
                background: color + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <span style={{ color, fontSize: '1.25rem' }}>{icon}</span>
            </div>
            <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{description}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 600, color }}>
                Open <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </div>
        </div>
    );
};

export default function SuperAdminDashboard() {
    const { user } = useAuth();
    const collegeName = user?.collegeName || user?.college?.collegeName || 'Your Institution';
    const adminName = user?.fullName || user?.name || user?.email || 'Admin';

    return (
        <DashboardLayout title="Institution Dashboard">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Welcome banner */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 60%, #0891b2 100%)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem 2.5rem',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.7, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Institution Admin</div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.375rem 0', letterSpacing: '-0.02em' }}>
                            Welcome back, {adminName} 👋
                        </h1>
                        <p style={{ opacity: 0.8, margin: 0, fontSize: '0.9375rem' }}>
                            Managing placement operations for <strong>{collegeName}</strong>
                        </p>
                    </div>
                </div>

                {/* Quick access cards */}
                <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                        Quick Access
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
                        <NavCard
                            icon="👥"
                            title="Students"
                            description="View, search and manage all registered students in your institution."
                            to="/admin/dashboard/students"
                            color="#6366f1"
                        />
                        <NavCard
                            icon="🏢"
                            title="Companies & Rounds"
                            description="Manage recruiting companies and define interview rounds."
                            to="/admin/dashboard/companies"
                            color="#0ea5e9"
                        />
                        <NavCard
                            icon="📅"
                            title="Schedules"
                            description="Create and manage interview schedules for students and rooms."
                            to="/admin/dashboard/schedules"
                            color="#10b981"
                        />
                        <NavCard
                            icon="🚪"
                            title="Rooms"
                            description="Add and manage interview rooms and their seating capacity."
                            to="/admin/dashboard/rooms"
                            color="#f59e0b"
                        />
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}