import { useState } from "react";
import { api } from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";

const STEPS = [
    { num: 1, label: 'Email', desc: 'Enter your college email' },
    { num: 2, label: 'Verify', desc: 'Enter the OTP sent to you' },
    { num: 3, label: 'Password', desc: 'Create a secure password' },
];

export default function UserSignUp() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [token, setToken] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleStep1 = async (e) => {
        e.preventDefault();
        setLoading(true); setErrorMsg('');
        try {
            await api.post("/api/auth/student/sendotp", { email });
            setStep(2);
        } catch { setErrorMsg("Failed to send OTP. Please check your email and try again."); }
        finally { setLoading(false); }
    };

    const handleStep2 = async (e) => {
        e.preventDefault();
        setLoading(true); setErrorMsg('');
        try {
            const response = await api.post("/api/auth/student/validateotp", { email, otp });
            setToken(response.data);
            setStep(3);
        } catch { setErrorMsg("Invalid OTP. Please try again."); }
        finally { setLoading(false); }
    };

    const handleStep3 = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) { setErrorMsg("Passwords do not match."); return; }
        setLoading(true); setErrorMsg('');
        try {
            await api.post("/api/auth/student/setpassword", { token, password });
            navigate("/dashboard");
        } catch { setErrorMsg("Failed to set password. Please try again."); }
        finally { setLoading(false); }
    };

    const handlers = [null, handleStep1, handleStep2, handleStep3];
    const btnLabels = { 1: 'Send OTP', 2: 'Verify OTP', 3: 'Complete Sign Up' };
    const loadingLabels = { 1: 'Sending OTP…', 2: 'Verifying…', 3: 'Setting up…' };

    return (
        <div style={styles.page}>
            {/* Left panel */}
            <div style={styles.leftPanel}>
                <div style={styles.leftContent}>
                    <div style={styles.brandLogo}>Placemate</div>
                    <div style={styles.brandTagline}>Start your placement journey</div>

                    <div style={styles.stepsGuide}>
                        {STEPS.map((s, i) => (
                            <div key={s.num} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{
                                        ...styles.stepCircle,
                                        background: step > s.num ? 'rgba(255,255,255,0.9)' : step === s.num ? 'white' : 'rgba(255,255,255,0.2)',
                                        color: step >= s.num ? '#4f46e5' : 'rgba(255,255,255,0.6)',
                                    }}>
                                        {step > s.num
                                            ? <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>
                                            : s.num
                                        }
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div style={{ width: 2, height: 36, background: step > s.num ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', margin: '4px 0' }} />
                                    )}
                                </div>
                                <div style={{ paddingTop: '0.1rem' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: step >= s.num ? 'white' : 'rgba(255,255,255,0.5)' }}>{s.label}</div>
                                    <div style={{ fontSize: '0.8rem', color: step >= s.num ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.35)', marginTop: '0.125rem' }}>{s.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={styles.leftBg} />
            </div>

            {/* Right panel */}
            <div style={styles.rightPanel}>
                <div style={styles.formBox}>
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={styles.badge}>Step {step} of 3</div>
                        <h1 style={styles.heading}>
                            {step === 1 ? 'Create your account' : step === 2 ? 'Check your email' : 'Set your password'}
                        </h1>
                        <p style={styles.subheading}>
                            {step === 1 ? 'Enter your college email to get started' : step === 2 ? `We sent a 6-digit OTP to ${email}` : 'Choose a strong password for your account'}
                        </p>
                    </div>

                    {errorMsg && (
                        <div style={styles.errorAlert}>
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handlers[step]} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {step === 1 && (
                            <div>
                                <label style={styles.label}>College Email</label>
                                <input
                                    style={styles.input}
                                    type="email" required value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="student@college.edu"
                                    onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                                    onBlur={e => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none', background: '#f8fafc' })}
                                />
                                <p style={styles.hint}>We'll send a one-time password to verify your email</p>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <label style={styles.label}>One-Time Password (OTP)</label>
                                <input
                                    style={{ ...styles.input, fontSize: '1.5rem', letterSpacing: '0.35em', textAlign: 'center', fontWeight: 700 }}
                                    type="text" required value={otp} maxLength={6}
                                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="• • • • • •"
                                    onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                                    onBlur={e => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none', background: '#f8fafc' })}
                                />
                                <button type="button" style={styles.resendBtn} onClick={() => { setStep(1); setOtp(''); setErrorMsg(''); }}>
                                    ← Wrong email? Change it
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <>
                                <div>
                                    <label style={styles.label}>Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            style={styles.input}
                                            type={showPwd ? 'text' : 'password'} required value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="Min. 8 characters"
                                            onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                                            onBlur={e => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none', background: '#f8fafc' })}
                                        />
                                        <button type="button" onClick={() => setShowPwd(v => !v)} style={styles.eyeBtn} tabIndex={-1}>
                                            {showPwd
                                                ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                                : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            }
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label style={styles.label}>Confirm Password</label>
                                    <input
                                        style={{ ...styles.input, borderColor: confirmPassword && confirmPassword !== password ? '#ef4444' : '#e2e8f0' }}
                                        type={showPwd ? 'text' : 'password'} required value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                                        onBlur={e => Object.assign(e.target.style, { borderColor: confirmPassword && confirmPassword !== password ? '#ef4444' : '#e2e8f0', boxShadow: 'none', background: '#f8fafc' })}
                                    />
                                    {confirmPassword && password !== confirmPassword && (
                                        <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.375rem', fontWeight: 500 }}>Passwords don't match</p>
                                    )}
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading || (step === 3 && (!password || password !== confirmPassword))}
                            style={(loading || (step === 3 && (!password || password !== confirmPassword))) ? { ...styles.submitBtn, opacity: 0.65, cursor: 'not-allowed' } : styles.submitBtn}
                        >
                            {loading
                                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><span style={styles.spinner} />{loadingLabels[step]}</span>
                                : btnLabels[step]
                            }
                        </button>
                    </form>

                    <div style={styles.divider}>
                        <div style={styles.dividerLine} />
                        <span style={styles.dividerText}>or</span>
                        <div style={styles.dividerLine} />
                    </div>

                    <p style={styles.footerText}>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.link}>Sign in →</Link>
                    </p>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

const styles = {
    page: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: '#f8fafc' },
    leftPanel: { flex: '1', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0ea5e9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', position: 'relative', overflow: 'hidden', minHeight: '100vh' },
    leftBg: { position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.07) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)', pointerEvents: 'none' },
    leftContent: { position: 'relative', zIndex: 1, color: 'white', maxWidth: '380px' },
    brandLogo: { fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.375rem' },
    brandTagline: { fontSize: '1rem', opacity: 0.75, marginBottom: '3rem', fontWeight: 400 },
    stepsGuide: { display: 'flex', flexDirection: 'column', gap: 0 },
    stepCircle: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0, transition: 'all 0.3s' },
    rightPanel: { width: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2.5rem', backgroundColor: '#ffffff', boxShadow: '-20px 0 60px rgba(0,0,0,0.06)' },
    formBox: { width: '100%', maxWidth: '380px' },
    badge: { display: 'inline-block', background: '#eef2ff', color: '#4f46e5', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.3rem 0.75rem', borderRadius: '999px', marginBottom: '1rem' },
    heading: { fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 0.375rem 0' },
    subheading: { color: '#64748b', fontSize: '0.9375rem', margin: 0 },
    errorAlert: { display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.875rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.625rem', color: '#b91c1c', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.25rem' },
    label: { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: '0.5rem' },
    input: { width: '100%', padding: '0.75rem 1rem', fontSize: '0.9375rem', fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, color: '#0f172a', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '0.625rem', outline: 'none', boxSizing: 'border-box', transition: 'all 0.15s' },
    inputFocus: { borderColor: '#6366f1', boxShadow: '0 0 0 3px rgba(99,102,241,0.18)', background: '#ffffff' },
    hint: { fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.375rem', margin: '0.375rem 0 0 0' },
    resendBtn: { background: 'none', border: 'none', color: '#6366f1', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.75rem', padding: 0, fontFamily: "'Inter', system-ui, sans-serif" },
    eyeBtn: { position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: 0 },
    submitBtn: { width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', border: 'none', borderRadius: '0.625rem', fontSize: '0.9375rem', fontWeight: 700, fontFamily: "'Inter', system-ui, sans-serif", cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', transition: 'all 0.2s', marginTop: '0.25rem' },
    spinner: { display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' },
    divider: { display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.75rem 0' },
    dividerLine: { flex: 1, height: '1px', background: '#e2e8f0' },
    dividerText: { fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 },
    footerText: { textAlign: 'center', fontSize: '0.875rem', color: '#64748b', margin: 0 },
    link: { color: '#6366f1', fontWeight: 700, textDecoration: 'none' },
};