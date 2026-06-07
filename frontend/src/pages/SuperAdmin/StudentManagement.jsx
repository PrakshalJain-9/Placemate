import { useEffect, useState, useRef } from "react";
import { api } from "../../api/axios";

// ── tiny helpers ──────────────────────────────────────────────────────────────
const Badge = ({ children, color }) => (
    <span style={{
        display: 'inline-block',
        padding: '0.2rem 0.6rem',
        borderRadius: '999px',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        background: color === 'blue' ? '#dbeafe' : color === 'green' ? '#dcfce7' : color === 'amber' ? '#fef9c3' : '#f3f4f6',
        color: color === 'blue' ? '#1e40af' : color === 'green' ? '#166534' : color === 'amber' ? '#854d0e' : '#374151',
    }}>
        {children}
    </span>
);

const Toast = ({ message, type, onClose }) => (
    <div style={{
        position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999,
        display: 'flex', alignItems: 'center', gap: '0.625rem',
        padding: '0.875rem 1.25rem',
        background: type === 'error' ? '#fef2f2' : '#f0fdf4',
        border: `1px solid ${type === 'error' ? '#fecaca' : '#a7f3d0'}`,
        borderRadius: '0.625rem',
        color: type === 'error' ? '#b91c1c' : '#166534',
        fontWeight: 600, fontSize: '0.875rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        animation: 'slideUp 0.25s ease',
    }}>
        {type === 'error'
            ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            : <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 6L9 17l-5-5"/></svg>
        }
        {message}
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '0.25rem', opacity: 0.6, fontSize: '1rem', lineHeight: 1 }}>×</button>
    </div>
);

export default function StudentManagement() {
    // ── list state ─────────────────────────────────────────────────────────────
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // ── live search ────────────────────────────────────────────────────────────
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // ── add student form ───────────────────────────────────────────────────────
    const [newStudent, setNewStudent] = useState({ name: '', email: '', rollNumber: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ── inline role editing ────────────────────────────────────────────────────
    const [editingRoleId, setEditingRoleId] = useState(null);
    const [pendingRole, setPendingRole] = useState('');
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);

    // ── toast ──────────────────────────────────────────────────────────────────
    const [toast, setToast] = useState(null);
    const toastTimer = useRef(null);

    const showToast = (message, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ message, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    // ── fetch ──────────────────────────────────────────────────────────────────
    const fetchStudents = async (q = searchQuery, p = page, s = size) => {
        setIsLoading(true);
        try {
            const params = { page: p, size: s };
            if (q.trim()) params.search = q.trim();
            const res = await api.get("/api/superadmin/students", { params });
            setStudents(res.data.content ?? []);
            setTotalPages(res.data.totalPages ?? 0);
            setTotalElements(res.data.totalElements ?? 0);
        } catch {
            showToast("Failed to load students.", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load
    useEffect(() => { fetchStudents(); }, []);

    // Debounced live search — updates table as user types
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(0);
            setSearchQuery(searchInput);
            fetchStudents(searchInput, 0, size);
        }, 350);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Re-fetch when page or size changes (but not on searchInput — that's above)
    useEffect(() => {
        fetchStudents(searchQuery, page, size);
    }, [page, size]);

    // ── add student ────────────────────────────────────────────────────────────
    const handleAddStudent = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post("/api/superadmin/students", newStudent);
            showToast(`Invite sent to ${newStudent.email} ✓`);
            setNewStudent({ name: '', email: '', rollNumber: '' });
            fetchStudents(searchQuery, page, size);
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to add student.", 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── delete ─────────────────────────────────────────────────────────────────
    const handleDeleteStudent = async (studentId) => {
        if (!window.confirm("Permanently delete this student?")) return;
        try {
            await api.delete(`/api/superadmin/students/${studentId}`);
            showToast("Student deleted.");
            fetchStudents(searchQuery, page, size);
        } catch {
            showToast("Failed to delete student.", 'error');
        }
    };

    // ── role update ────────────────────────────────────────────────────────────
    const startEditRole = (student) => {
        setEditingRoleId(student.id);
        // Pre-fill with the student's CURRENT role, never the logged-in user's role
        setPendingRole(student.role);
    };

    const cancelEditRole = () => {
        setEditingRoleId(null);
        setPendingRole('');
    };

    const saveRole = async (studentId) => {
        if (!pendingRole) return;
        setIsUpdatingRole(true);
        try {
            // Send only the student's new role — never derive role from auth context
            await api.patch(`/api/superadmin/students/${studentId}`, { role: pendingRole });
            showToast("Role updated successfully.");
            setEditingRoleId(null);
            fetchStudents(searchQuery, page, size);
        } catch {
            showToast("Failed to update role.", 'error');
        } finally {
            setIsUpdatingRole(false);
        }
    };

    // ── renotify (individual) ──────────────────────────────────────────────────
    const handleRenotify = async (email, id) => {
        try {
            await api.post(`/api/superadmin/students/renotify/${id}`);
            showToast(`Re-invitation sent to ${email} ✓`);
        } catch {
            showToast("Failed to send re-invitation.", 'error');
        }
    };

    // ── remind all pending (bulk) ──────────────────────────────────────────────
    const [isSendingReminder, setIsSendingReminder] = useState(false);

    const handleRemindAll = async () => {
        setIsSendingReminder(true);
        try {
            await api.post('/api/superadmin/reminder');
            showToast('Reminder emails sent to all pending students ✓');
        } catch {
            showToast('Failed to send reminder emails.', 'error');
        } finally {
            setIsSendingReminder(false);
        }
    };


    // ── render ─────────────────────────────────────────────────────────────────
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* ── Add Student Card ── */}
            <div className="card">
                <div className="form-panel-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-primary)" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                        </div>
                        <div>
                            <div className="form-panel-title">Add New Student</div>
                            <div className="form-panel-subtitle">Send an invitation email to onboard a student</div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleAddStudent} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Student Name</label>
                        <input className="input-field" required value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} placeholder="Jane Smith" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Roll Number</label>
                        <input className="input-field" required value={newStudent.rollNumber} onChange={e => setNewStudent({ ...newStudent, rollNumber: e.target.value })} placeholder="2024KUCP1001" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Email Address</label>
                        <input className="input-field" type="email" required value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} placeholder="jane@college.edu" />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                        style={{ alignSelf: 'end', whiteSpace: 'nowrap' }}
                    >
                        {isSubmitting ? 'Sending Invite…' : '+ Add Student'}
                    </button>
                </form>
            </div>

            {/* ── Student Directory Card ── */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div className="section-title">Student Directory</div>
                        <div className="section-subtitle">
                            {isLoading ? 'Loading…' : `${totalElements} student${totalElements !== 1 ? 's' : ''} found`}
                        </div>
                    </div>

                    {/* Live search bar + Remind All */}
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div className="search-bar" style={{ minWidth: 260 }}>
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-text-muted)" strokeWidth={2} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            <input
                                className="input-field"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                placeholder="Search by name, email, roll no…"
                                style={{ paddingLeft: '2.5rem', paddingRight: searchInput ? '2.5rem' : '1rem' }}
                            />
                            {searchInput && (
                                <button
                                    onClick={() => setSearchInput('')}
                                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1, padding: 0 }}
                                >×</button>
                            )}
                        </div>

                        {/* Bulk reminder button */}
                        <button
                            onClick={handleRemindAll}
                            disabled={isSendingReminder}
                            className="btn btn-secondary"
                            style={{ whiteSpace: 'nowrap', gap: '0.4rem', fontSize: '0.82rem', padding: '0.5rem 0.875rem' }}
                            title="Send reminder email to all students who haven't joined yet"
                        >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {isSendingReminder ? 'Sending…' : 'Remind All Pending'}
                        </button>
                    </div>

                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Roll No.</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
                            ) : students.length === 0 ? (
                                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    {searchInput ? `No students matching "${searchInput}"` : 'No students yet.'}
                                </td></tr>
                            ) : students.map(student => (
                                <tr key={student.id}>
                                    <td style={{ fontWeight: 600 }}>{student.name}</td>
                                    <td style={{ color: 'var(--color-text-muted)' }}>{student.email}</td>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{student.rollNumber || '—'}</td>
                                    <td>
                                        {editingRoleId === student.id ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <select
                                                    value={pendingRole}
                                                    onChange={e => setPendingRole(e.target.value)}
                                                    style={{ padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-primary)', fontSize: '0.8rem', background: 'var(--color-surface)', cursor: 'pointer' }}
                                                    autoFocus
                                                >
                                                    <option value="STUDENT">STUDENT</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                </select>
                                                <button
                                                    onClick={() => saveRole(student.id)}
                                                    disabled={isUpdatingRole}
                                                    style={{ padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-primary)', color: 'white', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                                                >
                                                    {isUpdatingRole ? '…' : '✓'}
                                                </button>
                                                <button onClick={cancelEditRole} style={{ padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', fontSize: '0.75rem', cursor: 'pointer' }}>✕</button>
                                            </div>
                                        ) : (
                                            <Badge color={student.role === 'ADMIN' ? 'blue' : 'default'}>
                                                {student.role}
                                            </Badge>
                                        )}
                                    </td>
                                    <td>
                                        {/* JOINED = green, NOTJOINED = amber */}
                                        <Badge color={student.status === 'JOINED' ? 'green' : 'amber'}>
                                            {student.status === 'JOINED' ? 'Joined' : student.status === 'NOTJOINED' ? 'Not Joined' : student.status ?? '—'}
                                        </Badge>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                            {/* Show Resend Invite only for students who haven't joined */}
                                            {student.status === 'NOTJOINED' && (
                                                <button
                                                    onClick={() => handleRenotify(student.email, student.id)}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                                                >
                                                    Resend Invite
                                                </button>
                                            )}
                                            {editingRoleId !== student.id && (
                                                <button
                                                    onClick={() => startEditRole(student)}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                                                >
                                                    Change Role
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteStudent(student.id)}
                                                className="btn"
                                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', background: '#fef2f2', color: 'var(--color-error)', border: '1px solid #fecaca' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                            Rows per page:
                            <select
                                value={size}
                                onChange={e => { setSize(Number(e.target.value)); setPage(0); }}
                                style={{ padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', fontSize: '0.85rem' }}
                            >
                                {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                            Page {page + 1} of {totalPages} · {totalElements} total
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-secondary" onClick={() => setPage(p => p - 1)} disabled={page === 0} style={{ padding: '0.4rem 0.875rem', fontSize: '0.82rem' }}>← Prev</button>
                            <button className="btn btn-secondary" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} style={{ padding: '0.4rem 0.875rem', fontSize: '0.82rem' }}>Next →</button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}