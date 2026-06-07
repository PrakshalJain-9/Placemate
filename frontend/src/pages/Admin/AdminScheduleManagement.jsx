import { useState, useEffect } from "react";
import { api } from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import Button from "../../components/Button";
import Input from "../../components/Input";
import LoadingSpinner from "../../components/LoadingSpinner";

const SearchIcon = () => (
  <svg className="search-bar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/>
  </svg>
);

const StatusBadge = ({ status }) => {
    const map = {
        Completed:  { cls: 'badge-green',  label: 'Completed' },
        InProcess:  { cls: 'badge-yellow', label: 'In Progress' },
        Pending:    { cls: 'badge-gray',   label: 'Pending' },
        Scheduled:  { cls: 'badge-blue',   label: 'Scheduled' },
    };
    const { cls, label } = map[status] || { cls: 'badge-gray', label: status };
    return <span className={`badge badge-dot ${cls}`}>{label}</span>;
};

const AutocompleteField = ({ label, stepNum, selectedItem, selectedLabel, onClear, searchValue, onSearchChange, options, onSelect, renderOption, renderOptionSub, placeholder, disabled }) => (
    <div className="form-group">
        <label className="form-label">{stepNum && <span style={{ color: 'var(--color-primary)', marginRight: '0.4rem' }}>{stepNum}.</span>}{label}</label>
        {selectedItem ? (
            <div className="selected-tag">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" fill="var(--color-primary)" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span className="selected-tag-text">{selectedLabel}</span>
                </div>
                <button type="button" className="selected-tag-change" onClick={onClear}>Change</button>
            </div>
        ) : (
            <div className="autocomplete-wrapper">
                <input
                    className="input-field"
                    type="text"
                    placeholder={placeholder}
                    value={searchValue}
                    onChange={e => onSearchChange(e.target.value)}
                    disabled={disabled}
                />
                {options.length > 0 && (
                    <ul className="autocomplete-dropdown">
                        {options.map((opt, i) => (
                            <li key={i} className="autocomplete-item" onClick={() => onSelect(opt)}>
                                <div>{renderOption(opt)}</div>
                                {renderOptionSub && <div className="autocomplete-item-sub">{renderOptionSub(opt)}</div>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )}
    </div>
);

export default function AdminScheduleManagement() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [editingScheduleId, setEditingScheduleId] = useState(null);

    const [formData, setFormData] = useState({
        interviewRoundId: '', studentId: '', roomId: '',
        startDate: '', startTime: '', status: 'Pending', version: null
    });

    const [companySearch, setCompanySearch] = useState('');
    const [companyOptions, setCompanyOptions] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [roundOptions, setRoundOptions] = useState([]);

    const [roomSearch, setRoomSearch] = useState('');
    const [roomOptions, setRoomOptions] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const [studentSearch, setStudentSearch] = useState('');
    const [studentOptions, setStudentOptions] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [schedulePage, setSchedulePage] = useState(0);
    const [scheduleTotalPages, setScheduleTotalPages] = useState(1);
    const [scheduleSearchName, setScheduleSearchName] = useState('');

    // Debounced live search — fires 350ms after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setSchedulePage(0);
        }, 350);
        return () => clearTimeout(timer);
    }, [scheduleSearchName]);

    useEffect(() => { fetchSchedules(); }, [schedulePage, scheduleSearchName]);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const params = { page: schedulePage, size: 6 };
            if (scheduleSearchName) params.q = scheduleSearchName;
            const res = await api.get(
                scheduleSearchName ? "/api/admin/schedules" : "/api/admin/schedules/college",
                { params }
            );
            const data = res.data.content ?? res.data;
            setSchedules(Array.isArray(data) ? data : []);
            setScheduleTotalPages(res.data.totalPages || 1);
        } catch { setError("Failed to load schedules."); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        if (!companySearch.trim()) { setCompanyOptions([]); return; }
        const t = setTimeout(async () => {
            try {
                const res = await api.get("/api/admin/company", { params: { companyName: companySearch, size: 5 } });
                setCompanyOptions(res.data.content || []);
            } catch { /* ignore */ }
        }, 400);
        return () => clearTimeout(t);
    }, [companySearch]);

    useEffect(() => {
        if (!selectedCompany) { setRoundOptions([]); return; }
        api.get("/api/admin/interview-round", { params: { companyId: selectedCompany.companyId, size: 50 } })
            .then(res => setRoundOptions(res.data.content || []))
            .catch(() => {});
    }, [selectedCompany]);

    useEffect(() => {
        if (!roomSearch.trim()) { setRoomOptions([]); return; }
        const t = setTimeout(async () => {
            try {
                const res = await api.get("/api/admin/room", { params: { roomName: roomSearch, size: 5 } });
                setRoomOptions(res.data.content || []);
            } catch { /* ignore */ }
        }, 400);
        return () => clearTimeout(t);
    }, [roomSearch]);

    useEffect(() => {
        if (!studentSearch.trim()) { setStudentOptions([]); return; }
        const t = setTimeout(async () => {
            try {
                const res = await api.get("/api/admin/students", { params: { rollNumber: studentSearch, size: 5 } });
                setStudentOptions(res.data.content || []);
            } catch { /* ignore */ }
        }, 400);
        return () => clearTimeout(t);
    }, [studentSearch]);

    const resetForm = () => {
        setFormData({ interviewRoundId: '', studentId: '', roomId: '', startDate: '', startTime: '', status: 'Pending', version: null });
        setSelectedCompany(null); setSelectedRoom(null); setSelectedStudent(null);
        setIsEditing(false); setEditingScheduleId(null); setError('');
    };

    const handleEditClick = (sch) => {
        setIsEditing(true);
        setEditingScheduleId(sch.id);
        const d = new Date(sch.startTime);
        const pad = n => String(n).padStart(2, '0');
        setFormData({
            interviewRoundId: sch.interviewRound?.id || '',
            studentId: sch.student?.id || '',
            roomId: sch.room?.roomId || '',
            startDate: `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`,
            startTime: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
            status: sch.status || 'Pending',
            version: sch.version
        });
        setSelectedCompany(sch.interviewRound?.company || null);
        setSelectedStudent(sch.student || null);
        setSelectedRoom(sch.room || null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.interviewRoundId || !formData.roomId || !formData.studentId) {
            setError("Please complete all required selections."); return;
        }
        if (!formData.startDate || !formData.startTime) {
            setError("Please provide start date and time."); return;
        }
        setActionLoading(true); setError('');
        const payload = {
            interviewRoundId: parseInt(formData.interviewRoundId),
            studentId: parseInt(formData.studentId),
            roomId: parseInt(formData.roomId),
            startTime: `${formData.startDate}T${formData.startTime}:00`,
            status: formData.status,
            ...(isEditing && { version: formData.version })
        };
        try {
            if (isEditing) {
                await api.put(`/api/admin/schedules/${editingScheduleId}`, payload);
            } else {
                await api.post("/api/admin/schedules", payload);
            }
            fetchSchedules();
            resetForm();
        } catch (err) {
            if (isEditing && err.response?.status === 409) {
                setError("Conflict: Another admin updated this. Refreshing.");
                fetchSchedules(); resetForm();
            } else {
                setError(isEditing ? "Failed to update schedule." : "Failed to create schedule.");
            }
        } finally { setActionLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this schedule?")) return;
        try {
            await api.delete(`/api/admin/schedules/${id}`);
            setSchedules(prev => prev.filter(s => s.id !== id));
            if (editingScheduleId === id) resetForm();
        } catch { alert("Failed to delete schedule."); }
    };

    if (loading && schedules.length === 0) {
        return <DashboardLayout title="Schedule Management"><LoadingSpinner message="Loading schedules..." /></DashboardLayout>;
    }

    return (
        <DashboardLayout title="Schedule Management">
            <div className="panel-grid" style={{ gridTemplateColumns: '400px 1fr' }}>
                {/* ── FORM ── */}
                <div className="panel-form">
                    <div className={`card ${isEditing ? 'card--highlighted' : ''}`}>
                        <div className="form-panel-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 'var(--radius-md)',
                                    background: isEditing ? '#fef3c7' : 'var(--color-primary-light)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={isEditing ? '#d97706' : 'var(--color-primary)'} strokeWidth={2}>
                                        {isEditing
                                            ? <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                            : <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                                        }
                                    </svg>
                                </div>
                                <div>
                                    <div className="form-panel-title">{isEditing ? 'Edit Schedule' : 'New Interview Schedule'}</div>
                                    <div className="form-panel-subtitle">{isEditing ? `Editing ID #${editingScheduleId}` : 'Create a new interview slot'}</div>
                                </div>
                            </div>
                        </div>

                        {error && <div className="alert alert-error">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            {/* Company + Round row */}
                            <AutocompleteField
                                label="Company"
                                stepNum="1"
                                selectedItem={selectedCompany}
                                selectedLabel={selectedCompany?.companyName}
                                onClear={() => { setSelectedCompany(null); setFormData(p => ({...p, interviewRoundId:''})); }}
                                searchValue={companySearch}
                                onSearchChange={setCompanySearch}
                                options={companyOptions}
                                onSelect={(c) => { setSelectedCompany(c); setCompanySearch(''); setCompanyOptions([]); setFormData(p=>({...p,interviewRoundId:''})); }}
                                renderOption={c => c.companyName}
                                placeholder="Search company name..."
                            />

                            <div className="form-group">
                                <label className="form-label"><span style={{ color: 'var(--color-primary)', marginRight: '0.4rem' }}>2.</span>Interview Round</label>
                                <select
                                    className="input-field"
                                    value={formData.interviewRoundId}
                                    onChange={e => setFormData(p => ({...p, interviewRoundId: e.target.value}))}
                                    disabled={!selectedCompany}
                                    required
                                >
                                    <option value="">
                                        {!selectedCompany ? 'Select a company first' : roundOptions.length === 0 ? 'No rounds for this company' : '-- Select a round --'}
                                    </option>
                                    {roundOptions.map(r => (
                                        <option key={r.id} value={r.id}>{r.interviewName} ({r.durationInMinutes}m)</option>
                                    ))}
                                </select>
                            </div>

                            <hr className="divider" style={{ margin: '1rem 0' }} />

                            <AutocompleteField
                                label="Student"
                                stepNum="3"
                                selectedItem={selectedStudent}
                                selectedLabel={`${selectedStudent?.name} (${selectedStudent?.rollNumber})`}
                                onClear={() => { setSelectedStudent(null); setFormData(p=>({...p,studentId:''})); }}
                                searchValue={studentSearch}
                                onSearchChange={setStudentSearch}
                                options={studentOptions}
                                onSelect={(s) => { setSelectedStudent(s); setFormData(p=>({...p,studentId:s.id})); setStudentSearch(''); setStudentOptions([]); }}
                                renderOption={s => s.name}
                                renderOptionSub={s => s.rollNumber}
                                placeholder="Search by roll number..."
                            />

                            <AutocompleteField
                                label="Room"
                                stepNum="4"
                                selectedItem={selectedRoom}
                                selectedLabel={`${selectedRoom?.roomName} (Cap: ${selectedRoom?.capacity})`}
                                onClear={() => { setSelectedRoom(null); setFormData(p=>({...p,roomId:''})); }}
                                searchValue={roomSearch}
                                onSearchChange={setRoomSearch}
                                options={roomOptions}
                                onSelect={(r) => { setSelectedRoom(r); setFormData(p=>({...p,roomId:r.roomId})); setRoomSearch(''); setRoomOptions([]); }}
                                renderOption={r => r.roomName}
                                renderOptionSub={r => `Capacity: ${r.capacity}`}
                                placeholder="Search room name..."
                            />

                            <hr className="divider" style={{ margin: '1rem 0' }} />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Date</label>
                                    <input className="input-field" type="date" value={formData.startDate} onChange={e => setFormData(p=>({...p,startDate:e.target.value}))} required />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Time</label>
                                    <input className="input-field" type="time" value={formData.startTime} onChange={e => setFormData(p=>({...p,startTime:e.target.value}))} required />
                                </div>
                            </div>

                            <div className="form-group mt-4">
                                <label className="form-label">Status</label>
                                <select className="input-field" value={formData.status} onChange={e => setFormData(p=>({...p,status:e.target.value}))}>
                                    <option value="Pending">Pending</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="InProcess">In Process</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            <div className="flex gap-2 mt-4" style={{ flexWrap: 'wrap' }}>
                                <Button type="submit" disabled={actionLoading} style={{ flex: 1, minWidth: 120 }}>
                                    {actionLoading ? 'Saving...' : isEditing ? 'Update Schedule' : 'Create Schedule'}
                                </Button>
                                {isEditing && (
                                    <>
                                        <Button type="button" variant="secondary" onClick={resetForm} disabled={actionLoading}>Cancel</Button>
                                        <Button type="button" variant="danger" onClick={() => handleDelete(editingScheduleId)} disabled={actionLoading}>Delete</Button>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* ── LIST ── */}
                <div>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <div className="section-title">Interview Schedules</div>
                                <div className="section-subtitle">Click any card to edit</div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <div className="search-bar" style={{ minWidth: 200 }}>
                                        <SearchIcon />
                                        <input
                                            className="input-field"
                                            value={scheduleSearchName}
                                            onChange={e => setScheduleSearchName(e.target.value)}
                                            placeholder="Search by student, roll..."
                                            style={{ paddingLeft: '2.5rem' }}
                                        />
                                    </div>
                                    {scheduleSearchName && (
                                        <Button type="button" variant="secondary" size="sm" onClick={() => setScheduleSearchName('')}>Clear</Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            {loading ? (
                                <div className="spinner-container"><div className="spinner" /></div>
                            ) : schedules.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">
                                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                                        </svg>
                                    </div>
                                    <div className="empty-state-title">No schedules found</div>
                                    <div className="empty-state-sub">{scheduleSearchName ? 'Try a different search.' : 'Create your first interview schedule using the form.'}</div>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                                    {schedules.map(sch => (
                                        <div
                                            key={sch.id}
                                            className={`schedule-card ${editingScheduleId === sch.id ? 'active' : ''}`}
                                            onClick={() => handleEditClick(sch)}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', background: 'var(--color-surface-2)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                                                    #{sch.id}
                                                </span>
                                                <StatusBadge status={sch.status} />
                                            </div>

                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', marginBottom: '0.125rem' }}>
                                                    {sch.student?.name || 'Unknown Student'}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                                    {sch.student?.rollNumber}
                                                </div>
                                            </div>

                                            <div style={{ padding: '0.75rem 0', borderTop: '1px dashed var(--color-border)', borderBottom: '1px dashed var(--color-border)', marginBottom: '0.75rem' }}>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.2rem' }}>
                                                    {sch.interviewRound?.company?.companyName}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                                    {sch.interviewRound?.interviewName}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                                                    <span>{sch.room?.roomName || 'No room'}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                                    <span>{new Date(sch.startTime).toLocaleString(undefined, { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!loading && schedules.length > 0 && (
                                <div className="pagination">
                                    <Button variant="secondary" size="sm" disabled={schedulePage === 0} onClick={() => setSchedulePage(p => p - 1)}>← Prev</Button>
                                    <span className="pagination-info">Page {schedulePage + 1} of {scheduleTotalPages}</span>
                                    <Button variant="secondary" size="sm" disabled={schedulePage >= scheduleTotalPages - 1} onClick={() => setSchedulePage(p => p + 1)}>Next →</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}