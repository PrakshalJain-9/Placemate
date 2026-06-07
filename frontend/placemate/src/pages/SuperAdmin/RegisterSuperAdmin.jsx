import { useState } from "react";
import { requestEmailOtp, verifyOtpAndRegister } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";

const Field = ({ label, type = 'text', value, onChange, placeholder, required = true }) => (
    <div>
        <label style={styles.label}>{label}</label>
        <input
            type={type}
            required={required}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={styles.input}
            onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={e => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none', background: '#f8fafc' })}
        />
    </div>
);

export default function RegisterSuperAdmin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [collegeName, setCollegeName] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    async function handleRequestOtp(e) {
        e.preventDefault();
        setLoading(true); setErrorMsg("");
        try {
            await requestEmailOtp(email);
            setStep(2);
        } catch (error) {
            setErrorMsg(String(error?.message || "Failed to send OTP. Please try again."));
        } finally { setLoading(false); }
    }

    async function handleOtpValidation(e) {
        e.preventDefault();
        setLoading(true); setErrorMsg("");
        try {
            // Payload must exactly match SuperAdminRegisterRequestDTO:
            // { superAdminId, emailId, password, role, collegeDTO, otp }
            await verifyOtpAndRegister({
                superAdminId: null,
                emailId: email,
                password,
                role: 'SUPERADMIN',
                collegeDTO: {
                    collegeName,
                    address: { street, city, state, country, zipCode }
                },
                otp,
            });

            navigate("/admin/login");
        } catch (error) {
            setErrorMsg(String(error?.message || "Registration failed. Please try again."));
        } finally { setLoading(false); }
    }

    return (
        <div style={styles.page}>
            {/* Left panel */}
            <div style={styles.leftPanel}>
                <div style={styles.leftContent}>
                    <div style={styles.brandLogo}>Placemate</div>
                    <div style={styles.brandTagline}>Register your institution</div>

                    {/* Step progress */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {[
                            { n: 1, label: 'Institution Details', desc: 'Admin & college information' },
                            { n: 2, label: 'Verification', desc: 'Confirm your email with OTP' },
                        ].map((s, i, arr) => (
                            <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 700, fontSize: '0.875rem', flexShrink: 0,
                                        background: step > s.n ? 'rgba(255,255,255,0.9)' : step === s.n ? 'white' : 'rgba(255,255,255,0.2)',
                                        color: step >= s.n ? '#4f46e5' : 'rgba(255,255,255,0.5)',
                                        transition: 'all 0.3s',
                                    }}>
                                        {step > s.n
                                            ? <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>
                                            : s.n
                                        }
                                    </div>
                                    {i < arr.length - 1 && (
                                        <div style={{ width: 2, height: 40, background: step > s.n ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', margin: '4px 0' }} />
                                    )}
                                </div>
                                <div style={{ paddingTop: '0.1rem' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: step >= s.n ? 'white' : 'rgba(255,255,255,0.45)' }}>{s.label}</div>
                                    <div style={{ fontSize: '0.8rem', color: step >= s.n ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)', marginTop: '0.125rem' }}>{s.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={styles.leftBg} />
            </div>

            {/* Right panel — scrollable for large forms */}
            <div style={styles.rightPanel}>
                <div style={styles.formBox}>
                    <div style={{ marginBottom: '1.75rem' }}>
                        <div style={styles.badge}>Step {step} of 2</div>
                        <h1 style={styles.heading}>
                            {step === 1 ? 'Institution Setup' : 'Verify your email'}
                        </h1>
                        <p style={styles.subheading}>
                            {step === 1 ? 'Fill in your admin and college details' : `Enter the OTP sent to ${email}`}
                        </p>
                    </div>

                    {errorMsg && (
                        <div style={styles.errorAlert}>
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                            {errorMsg}
                        </div>
                    )}

                    {/* STEP 1 */}
                    {step === 1 && (
                        <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Admin info */}
                            <div>
                                <div style={styles.sectionHeader}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                    Admin Credentials
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <Field label="Admin Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@college.edu" />
                                    <Field label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" />
                                </div>
                            </div>

                            {/* Institution info */}
                            <div>
                                <div style={styles.sectionHeader}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                                    Institution Details
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <Field label="College / Institution Name" value={collegeName} onChange={e => setCollegeName(e.target.value)} placeholder="IIT Bombay" />
                                    <Field label="Street Address" value={street} onChange={e => setStreet(e.target.value)} placeholder="123 University Ave" />
                                    <div style={styles.fieldsGrid}>
                                        <Field label="City" value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai" />
                                        <Field label="State" value={state} onChange={e => setState(e.target.value)} placeholder="Maharashtra" />
                                        <Field label="Country" value={country} onChange={e => setCountry(e.target.value)} placeholder="India" />
                                        <Field label="Zip Code" value={zipCode} onChange={e => setZipCode(e.target.value)} placeholder="400001" />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} style={loading ? { ...styles.submitBtn, opacity: 0.65, cursor: 'not-allowed' } : styles.submitBtn}>
                                {loading
                                    ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><span style={styles.spinner}/>Sending OTP…</span>
                                    : 'Continue to Verification →'
                                }
                            </button>
                        </form>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <form onSubmit={handleOtpValidation} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={styles.otpInfo}>
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#4f46e5" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e1b4b' }}>Check your inbox</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>OTP sent to <strong>{email}</strong></div>
                                </div>
                            </div>

                            <div>
                                <label style={styles.label}>6-Digit OTP</label>
                                <input
                                    type="text" required maxLength={6}
                                    value={otp}
                                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="• • • • • •"
                                    style={{ ...styles.input, fontSize: '1.75rem', letterSpacing: '0.4em', textAlign: 'center', fontWeight: 700, padding: '1rem' }}
                                    onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                                    onBlur={e => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none', background: '#f8fafc' })}
                                />
                            </div>

                            <button type="submit" disabled={loading || otp.length < 6} style={(loading || otp.length < 6) ? { ...styles.submitBtn, opacity: 0.65, cursor: 'not-allowed' } : styles.submitBtn}>
                                {loading
                                    ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><span style={styles.spinner}/>Registering…</span>
                                    : 'Complete Registration'
                                }
                            </button>

                            <button type="button" onClick={() => { setStep(1); setOtp(''); setErrorMsg(''); }} style={styles.backBtn}>
                                ← Go back and edit details
                            </button>
                        </form>
                    )}

                    <div style={styles.divider}>
                        <div style={styles.dividerLine} />
                        <span style={styles.dividerText}>or</span>
                        <div style={styles.dividerLine} />
                    </div>
                    <p style={styles.footerText}>
                        Already registered?{' '}
                        <Link to="/admin/login" style={styles.link}>Sign in →</Link>
                    </p>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

const styles = {
    page: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: '#f8fafc' },
    leftPanel: { flex: '0 0 340px', background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 60%, #0891b2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2.5rem', position: 'relative', overflow: 'hidden', minHeight: '100vh' },
    leftBg: { position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)', pointerEvents: 'none' },
    leftContent: { position: 'relative', zIndex: 1, color: 'white', width: '100%' },
    brandLogo: { fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.25rem' },
    brandTagline: { fontSize: '0.9rem', opacity: 0.7, marginBottom: '2.5rem', fontWeight: 400 },
    rightPanel: { flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '3rem 2.5rem', backgroundColor: '#ffffff', overflowY: 'auto' },
    formBox: { width: '100%', maxWidth: '560px', paddingTop: '1rem' },
    badge: { display: 'inline-block', background: '#e0e7ff', color: '#4338ca', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.3rem 0.75rem', borderRadius: '999px', marginBottom: '1rem' },
    heading: { fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 0.375rem 0' },
    subheading: { color: '#64748b', fontSize: '0.9375rem', margin: 0 },
    errorAlert: { display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.875rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.625rem', color: '#b91c1c', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' },
    sectionHeader: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.625rem', marginBottom: '1rem' },
    fieldsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    label: { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: '0.4rem' },
    input: { width: '100%', padding: '0.7rem 0.875rem', fontSize: '0.9rem', fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, color: '#0f172a', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '0.5rem', outline: 'none', boxSizing: 'border-box', transition: 'all 0.15s' },
    inputFocus: { borderColor: '#6366f1', boxShadow: '0 0 0 3px rgba(99,102,241,0.18)', background: '#ffffff' },
    submitBtn: { width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)', color: 'white', border: 'none', borderRadius: '0.625rem', fontSize: '0.9375rem', fontWeight: 700, fontFamily: "'Inter', system-ui, sans-serif", cursor: 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,0.35)', transition: 'all 0.2s' },
    spinner: { display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' },
    backBtn: { background: 'none', border: 'none', color: '#6366f1', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: "'Inter', system-ui, sans-serif", textAlign: 'center', width: '100%' },
    otpInfo: { display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem 1.25rem', background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '0.625rem' },
    divider: { display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.75rem 0' },
    dividerLine: { flex: 1, height: '1px', background: '#e2e8f0' },
    dividerText: { fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 },
    footerText: { textAlign: 'center', fontSize: '0.875rem', color: '#64748b', margin: 0 },
    link: { color: '#4f46e5', fontWeight: 700, textDecoration: 'none' },
};