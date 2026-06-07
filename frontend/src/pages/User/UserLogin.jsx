import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../contexts/AuthContext";
import { api } from "../../api/axios";
import { loginWithGoogle } from "../../api/auth";

const STEPS = [
    {
        n: '1', color: '#6366f1', bg: '#eef2ff',
        title: 'College registers on Placemate',
        desc: "Your institution's admin signs up and registers your college on Placemate.",
    },
    {
        n: '2', color: '#0ea5e9', bg: '#e0f2fe',
        title: 'Admin invites you via email',
        desc: 'The admin adds your name, roll number, and email. You receive an invitation email with a link to set your password.',
    },
    {
        n: '3', color: '#10b981', bg: '#ecfdf5',
        title: 'You sign in here',
        desc: "Once you've accepted the invite and set your password, come back here and sign in with your college email.",
    },
];

function HowItWorks() {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ marginTop: '1.25rem', borderRadius: '0.625rem', border: '1px solid #e2e8f0', overflow: 'hidden', background: '#fafafa' }}>
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', padding: '0.75rem 1rem',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: '0.82rem', fontWeight: 600, color: '#475569', textAlign: 'left', gap: '0.5rem',
                }}
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    New here? How does Placemate work?
                </span>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    style={{ transition: 'transform 0.25s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
                >
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>

            <div style={{ maxHeight: open ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
                <div style={{ padding: '0 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ height: '1px', background: '#e2e8f0', marginBottom: '0.125rem' }} />
                    {STEPS.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                            <div style={{
                                flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                                background: s.bg, color: s.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.75rem', fontWeight: 800,
                            }}>
                                {s.n}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.15rem' }}>{s.title}</div>
                                <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>{s.desc}</div>
                            </div>
                        </div>
                    ))}
                    <div style={{
                        marginTop: '0.25rem', padding: '0.625rem 0.875rem',
                        background: '#fffbeb', border: '1px solid #fde68a',
                        borderRadius: '0.5rem', fontSize: '0.76rem', color: '#92400e', lineHeight: 1.5,
                    }}>
                        💡 <strong>Didn't receive an invite?</strong> Ask your college placement admin to add you to Placemate.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function UserLogin() {

    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        try {
            const response = await api.post("/api/auth/student/login", {
                emailId: email,
                password: password
            });
            login(response.data);
            navigate("/dashboard");
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.page}>
            {/* Left decorative panel */}
            <div style={styles.leftPanel}>
                <div style={styles.leftContent}>
                    <div style={styles.brandLogo}>Placemate</div>
                    <div style={styles.brandTagline}>Your campus placement portal</div>
                    <div style={styles.features}>
                        {['View your interview schedule in real-time', 'Track placement opportunities', 'Get instant notifications'].map((f, i) => (
                            <div key={i} style={styles.featureItem}>
                                <div style={styles.featureDot} />
                                <span>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={styles.leftBg} />
            </div>

            {/* Right form panel */}
            <div style={styles.rightPanel}>
                <div style={styles.formBox}>
                    {/* Header */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={styles.badge}>Student Portal</div>
                        <h1 style={styles.heading}>Welcome back</h1>
                        <p style={styles.subheading}>Sign in to access your dashboard</p>
                    </div>

                    {errorMsg && (
                        <div style={styles.errorAlert}>
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}>
                                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={styles.label}>Email address</label>
                            <input
                                style={styles.input}
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="student@college.edu"
                                onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                                onBlur={e => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
                            />
                        </div>

                        <div>
                            <label style={styles.label}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    style={styles.input}
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                                    onBlur={e => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    style={styles.eyeBtn}
                                    tabIndex={-1}
                                >
                                    {showPassword
                                        ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                        : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    }
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} style={loading ? { ...styles.submitBtn, opacity: 0.7, cursor: 'not-allowed' } : styles.submitBtn}>
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <span style={styles.spinner} /> Authenticating...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    {/* OR divider */}
                    <div style={styles.divider}>
                        <div style={styles.dividerLine} />
                        <span style={styles.dividerText}>or continue with</span>
                        <div style={styles.dividerLine} />
                    </div>

                    {/* Google OAuth button */}
                    <button
                        type="button"
                        onClick={loginWithGoogle}
                        style={styles.googleBtn}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                        {/* Official Google G logo */}
                        <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                            <path fill="none" d="M0 0h48v48H0z"/>
                        </svg>
                        Sign in with Google
                    </button>

                    <p style={{ ...styles.footerText, marginTop: '1.5rem' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={styles.link}>Create one here →</Link>
                    </p>

                    {/* How it works — collapsible */}
                    <HowItWorks />

                    {/* Institution Admin shortcut */}
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <Link
                            to="/admin/login"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: '#64748b',
                                textDecoration: 'none',
                                padding: '0.5rem 1rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '999px',
                                background: '#f8fafc',
                            }}
                        >
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Institution Admin? Sign in here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}


const styles = {
    page: {
        display: 'flex',
        minHeight: '100vh',
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: '#f8fafc',
    },
    leftPanel: {
        flex: '1',
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0ea5e9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
    },
    leftBg: {
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.07) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)',
        pointerEvents: 'none',
    },
    leftContent: {
        position: 'relative',
        zIndex: 1,
        color: 'white',
        maxWidth: '400px',
    },
    brandLogo: {
        fontSize: '2.5rem',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        marginBottom: '0.5rem',
    },
    brandTagline: {
        fontSize: '1rem',
        opacity: 0.75,
        marginBottom: '3rem',
        fontWeight: 400,
    },
    features: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        fontSize: '0.9375rem',
        opacity: 0.9,
    },
    featureDot: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.8)',
        flexShrink: 0,
    },
    rightPanel: {
        width: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2.5rem',
        backgroundColor: '#ffffff',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.06)',
    },
    formBox: {
        width: '100%',
        maxWidth: '380px',
    },
    badge: {
        display: 'inline-block',
        background: '#eef2ff',
        color: '#4f46e5',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '0.3rem 0.75rem',
        borderRadius: '999px',
        marginBottom: '1rem',
    },
    heading: {
        fontSize: '2rem',
        fontWeight: 800,
        color: '#0f172a',
        letterSpacing: '-0.02em',
        marginBottom: '0.375rem',
        margin: '0 0 0.375rem 0',
    },
    subheading: {
        color: '#64748b',
        fontSize: '0.9375rem',
        margin: 0,
    },
    errorAlert: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        padding: '0.875rem 1rem',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '0.625rem',
        color: '#b91c1c',
        fontSize: '0.875rem',
        fontWeight: 500,
        marginBottom: '1.25rem',
    },
    label: {
        display: 'block',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: '#475569',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        marginBottom: '0.5rem',
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        fontSize: '0.9375rem',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontWeight: 500,
        color: '#0f172a',
        background: '#f8fafc',
        border: '1.5px solid #e2e8f0',
        borderRadius: '0.625rem',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s, box-shadow 0.15s',
    },
    inputFocus: {
        borderColor: '#6366f1',
        boxShadow: '0 0 0 3px rgba(99,102,241,0.18)',
        background: '#ffffff',
    },
    eyeBtn: {
        position: 'absolute',
        right: '0.875rem',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        padding: 0,
    },
    submitBtn: {
        width: '100%',
        padding: '0.85rem',
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '0.625rem',
        fontSize: '0.9375rem',
        fontWeight: 700,
        fontFamily: "'Inter', system-ui, sans-serif",
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
        transition: 'all 0.2s',
        marginTop: '0.25rem',
    },
    spinner: {
        display: 'inline-block',
        width: '16px',
        height: '16px',
        border: '2px solid rgba(255,255,255,0.4)',
        borderTopColor: 'white',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        margin: '1.75rem 0',
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        background: '#e2e8f0',
    },
    dividerText: {
        fontSize: '0.8rem',
        color: '#94a3b8',
        fontWeight: 500,
    },
    footerText: {
        textAlign: 'center',
        fontSize: '0.875rem',
        color: '#64748b',
        margin: 0,
    },
    link: {
        color: '#6366f1',
        fontWeight: 700,
        textDecoration: 'none',
    },
    googleBtn: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: 'white',
        border: '1.5px solid #e2e8f0',
        borderRadius: '0.625rem',
        fontSize: '0.9375rem',
        fontWeight: 600,
        fontFamily: "'Inter', system-ui, sans-serif",
        color: '#374151',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    },
};