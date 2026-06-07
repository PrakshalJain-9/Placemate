import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../contexts/AuthContext";
import { loginSuperAdmin } from "../../api/auth";

export default function SuperAdminLogin() {
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true); setErrorMsg('');
        try {
            const data = await loginSuperAdmin({ emailId: email, password });
            login(data);
            navigate("/admin/dashboard");
        } catch {
            setErrorMsg("Invalid credentials. Please try again.");
        } finally { setLoading(false); }
    }

    return (
        <div style={styles.page}>
            {/* Left decorative panel */}
            <div style={styles.leftPanel}>
                <div style={styles.leftContent}>
                    <div style={styles.brandLogo}>Placemate</div>
                    <div style={styles.brandTagline}>Institution Admin Portal</div>
                    <div style={styles.features}>
                        {[
                            'Manage students & placement schedules',
                            'Track interview rounds across companies',
                            'Real-time room & schedule management',
                        ].map((f, i) => (
                            <div key={i} style={styles.featureItem}>
                                <div style={styles.featureDot} />
                                <span>{f}</span>
                            </div>
                        ))}
                    </div>
                    <div style={styles.adminBadge}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Admin-level access
                    </div>
                </div>
                <div style={styles.leftBg} />
            </div>

            {/* Right form panel */}
            <div style={styles.rightPanel}>
                <div style={styles.formBox}>
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={styles.badge}>Institution Admin</div>
                        <h1 style={styles.heading}>Welcome back</h1>
                        <p style={styles.subheading}>Sign in to your institution dashboard</p>
                    </div>

                    {errorMsg && (
                        <div style={styles.errorAlert}>
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}>
                                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={styles.label}>Admin Email</label>
                            <input
                                style={styles.input}
                                type="email" required value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@college.edu"
                                onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                                onBlur={e => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none', background: '#f8fafc' })}
                            />
                        </div>

                        <div>
                            <label style={styles.label}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    style={styles.input}
                                    type={showPassword ? 'text' : 'password'}
                                    required value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                                    onBlur={e => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none', background: '#f8fafc' })}
                                />
                                <button type="button" onClick={() => setShowPassword(v => !v)} style={styles.eyeBtn} tabIndex={-1}>
                                    {showPassword
                                        ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                        : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    }
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} style={loading ? { ...styles.submitBtn, opacity: 0.7, cursor: 'not-allowed' } : styles.submitBtn}>
                            {loading
                                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><span style={styles.spinner} />Authenticating...</span>
                                : 'Sign In to Dashboard'
                            }
                        </button>
                    </form>

                    <div style={styles.divider}>
                        <div style={styles.dividerLine} />
                        <span style={styles.dividerText}>or</span>
                        <div style={styles.dividerLine} />
                    </div>

                    <p style={styles.footerText}>
                        New institution?{' '}
                        <Link to="/admin/register" style={styles.link}>Register here →</Link>
                    </p>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

const styles = {
    page: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: '#f8fafc' },
    leftPanel: { flex: '1', background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 60%, #0891b2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', position: 'relative', overflow: 'hidden', minHeight: '100vh' },
    leftBg: { position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 50%)', pointerEvents: 'none' },
    leftContent: { position: 'relative', zIndex: 1, color: 'white', maxWidth: '400px' },
    brandLogo: { fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.375rem' },
    brandTagline: { fontSize: '1rem', opacity: 0.7, marginBottom: '3rem', fontWeight: 400 },
    features: { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' },
    featureItem: { display: 'flex', alignItems: 'center', gap: '0.875rem', fontSize: '0.9375rem', opacity: 0.88 },
    featureDot: { width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.8)', flexShrink: 0 },
    adminBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', fontWeight: 600, padding: '0.4rem 0.875rem', borderRadius: '999px' },
    rightPanel: { width: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2.5rem', backgroundColor: '#ffffff', boxShadow: '-20px 0 60px rgba(0,0,0,0.06)' },
    formBox: { width: '100%', maxWidth: '380px' },
    badge: { display: 'inline-block', background: '#e0e7ff', color: '#4338ca', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.3rem 0.75rem', borderRadius: '999px', marginBottom: '1rem' },
    heading: { fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 0.375rem 0' },
    subheading: { color: '#64748b', fontSize: '0.9375rem', margin: 0 },
    errorAlert: { display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.875rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.625rem', color: '#b91c1c', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.25rem' },
    label: { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: '0.5rem' },
    input: { width: '100%', padding: '0.75rem 1rem', fontSize: '0.9375rem', fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, color: '#0f172a', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '0.625rem', outline: 'none', boxSizing: 'border-box', transition: 'all 0.15s' },
    inputFocus: { borderColor: '#6366f1', boxShadow: '0 0 0 3px rgba(99,102,241,0.18)', background: '#ffffff' },
    eyeBtn: { position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: 0 },
    submitBtn: { width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)', color: 'white', border: 'none', borderRadius: '0.625rem', fontSize: '0.9375rem', fontWeight: 700, fontFamily: "'Inter', system-ui, sans-serif", cursor: 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,0.35)', transition: 'all 0.2s', marginTop: '0.25rem' },
    spinner: { display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' },
    divider: { display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.75rem 0' },
    dividerLine: { flex: 1, height: '1px', background: '#e2e8f0' },
    dividerText: { fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 },
    footerText: { textAlign: 'center', fontSize: '0.875rem', color: '#64748b', margin: 0 },
    link: { color: '#4f46e5', fontWeight: 700, textDecoration: 'none' },
};