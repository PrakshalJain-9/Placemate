import { useState, useEffect } from "react";
import { api } from "../../api/axios";

export default function AdminScheduleManagement() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    // --- ADDED: Edit State ---
    const [isEditing, setIsEditing] = useState(false);
    const [editingScheduleId, setEditingScheduleId] = useState(null);

    // --- MODIFIED: Added version to default state ---
    const [formData, setFormData] = useState({
        interviewRoundId: '',
        studentId: '',
        roomId: '',
        startTime: '',
        status: 'Pending',
        version: null
    });

    // --- TYPEAHEAD STATES ---
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

    // --- INITIAL LOAD ---
    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const res = await api.get("/api/admin/schedules-all");
            setSchedules(res.data.interviewSchedules || res.data); // Fallback depending on your backend wrapper
        } catch (err) {
            setError("Failed to load schedules.");
        } finally {
            setLoading(false);
        }
    };

    // --- DEBOUNCED SEARCHES ---
    useEffect(() => {
        if (!companySearch.trim()) { setCompanyOptions([]); return; }
        const timer = setTimeout(async () => {
            try {
                const res = await api.get("/api/admin/company", { params: { companyName: companySearch, size: 5 } });
                setCompanyOptions(res.data.content || []);
            } catch (err) { console.error(err); }
        }, 400);
        return () => clearTimeout(timer);
    }, [companySearch]);

    useEffect(() => {
        if (!selectedCompany) { setRoundOptions([]); return; }
        const fetchRoundsForCompany = async () => {
            try {
                const res = await api.get("/api/admin/interview-round", {
                    params: { companyId: selectedCompany.companyId, size: 50 }
                });
                setRoundOptions(res.data.content || []);
            } catch (err) { console.error(err); }
        };
        fetchRoundsForCompany();
    }, [selectedCompany]);

    useEffect(() => {
        if (!roomSearch.trim()) { setRoomOptions([]); return; }
        const timer = setTimeout(async () => {
            try {
                const res = await api.get("/api/admin/room", { params: { roomName: roomSearch, size: 5 } });
                setRoomOptions(res.data.content || []);
            } catch (err) { console.error(err); }
        }, 400);
        return () => clearTimeout(timer);
    }, [roomSearch]);

    useEffect(() => {
        if (!studentSearch.trim()) { setStudentOptions([]); return; }
        const timer = setTimeout(async () => {
            try {
                const res = await api.get("/api/admin/students", { params: { rollNumber: studentSearch, size: 5 } });
                setStudentOptions(res.data.content || []);
            } catch (err) { console.error(err); }
        }, 400);
        return () => clearTimeout(timer);
    }, [studentSearch]);

    // --- SELECTION HANDLERS ---
    const handleSelectCompany = (c) => {
        setSelectedCompany(c); setCompanySearch(''); setCompanyOptions([]);
        setFormData(prev => ({ ...prev, interviewRoundId: '' }));
    };
    const clearCompanySelection = () => { setSelectedCompany(null); setFormData(prev => ({ ...prev, interviewRoundId: '' })); };

    const handleSelectRoom = (r) => {
        setSelectedRoom(r); setFormData(prev => ({ ...prev, roomId: r.roomId }));
        setRoomSearch(''); setRoomOptions([]);
    };
    const clearRoomSelection = () => { setSelectedRoom(null); setFormData(prev => ({ ...prev, roomId: '' })); };

    const handleSelectStudent = (s) => {
        setSelectedStudent(s); setFormData(prev => ({ ...prev, studentId: s.id }));
        setStudentSearch(''); setStudentOptions([]);
    };
    const clearStudentSelection = () => { setSelectedStudent(null); setFormData(prev => ({ ...prev, studentId: '' })); };

    // --- ADDED: Edit Click Handler ---
    const handleEditClick = (sch) => {
        setIsEditing(true);
        setEditingScheduleId(sch.id);

        // 1. Format the date for the HTML datetime-local input (YYYY-MM-DDTHH:mm)
        const formattedTime = new Date(sch.startTime).toISOString().slice(0, 16);

        // 2. Set the form data, capturing the crucial VERSION
        setFormData({
            interviewRoundId: sch.interviewRound?.id || '',
            studentId: sch.student?.id || '',
            roomId: sch.room?.roomId || '',
            startTime: formattedTime,
            status: sch.status || 'Pending',
            version: sch.version
        });

        // 3. Pre-fill the Typeahead display boxes by extracting nested DTO data
        setSelectedCompany(sch.interviewRound?.company || null);
        setSelectedStudent(sch.student || null);
        setSelectedRoom(sch.room || null);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- ADDED: Cancel / Reset Form Handler ---
    const resetForm = () => {
        setFormData({ interviewRoundId: '', studentId: '', roomId: '', startTime: '', status: 'Pending', version: null });
        setSelectedCompany(null);
        setSelectedRoom(null);
        setSelectedStudent(null);
        setIsEditing(false);
        setEditingScheduleId(null);
        setError('');
    };

    // --- MODIFIED: Submit Handler for Updates & Conflicts ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.interviewRoundId || !formData.roomId || !formData.studentId) {
            setError("Please complete all selections.");
            return;
        }

        setActionLoading(true); setError('');

        const payload = {
            interviewRoundId: parseInt(formData.interviewRoundId),
            studentId: parseInt(formData.studentId),
            roomId: parseInt(formData.roomId),
            startTime: formData.startTime,
            status: formData.status
        };

        // Conditionally attach the version if we are updating
        if (isEditing) {
            payload.version = formData.version;
        }

        try {
            if (isEditing) {
                // Adjust this URL to match your backend PUT/PATCH endpoint
                const res = await api.put(`/api/admin/schedules/${editingScheduleId}`, payload);
                setSchedules(prev => prev.map(s => s.id === editingScheduleId ? res.data : s));
            } else {
                const res = await api.post("/api/admin/schedules/addschedule", payload);
                setSchedules(prev => [...prev, res.data]);
            }
            resetForm();
        } catch (err) {
            // --- The Optimistic Lock Check ---
            if (isEditing && err.response?.status === 409) {
                setError("Data Conflict: Another admin updated this schedule while you were editing. The latest data has been fetched.");
                fetchSchedules(); // Auto-refresh the stale table
                resetForm();      // Clear the form so they don't overwrite the fresh data
            } else {
                setError(isEditing ? "Failed to update schedule." : "Failed to create schedule.");
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this schedule?")) return;
        try {
            await api.delete(`/api/admin/schedules/${id}`);
            setSchedules(prev => prev.filter(s => s.id !== id));
        } catch (err) { alert("Failed to delete schedule."); }
    };

    // --- UI RENDER ---
    return (
        <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
            <h2>Interview Schedule Management</h2>
            {error && <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>{error}</div>}

            <div style={{ border: '1px solid #ccc', padding: '25px', marginBottom: '30px', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>

                {/* Changed title based on edit state */}
                <h3 style={{ marginTop: 0 }}>{isEditing ? "Edit Interview Schedule" : "Schedule New Interview"}</h3>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

                        {/* 1. COMPANY */}
                        <div style={{ position: 'relative' }}>
                            <label style={{ fontWeight: 'bold' }}>1. Select Company</label>
                            {selectedCompany ? (
                                <div style={{ padding: '10px', border: '1px solid #28a745', borderRadius: '4px', backgroundColor: '#e9f7ef', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>✅ {selectedCompany.companyName}</span>
                                    <button type="button" onClick={clearCompanySelection} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Change</button>
                                </div>
                            ) : (
                                <>
                                    <input type="text" placeholder="Search company name..." value={companySearch} onChange={e => setCompanySearch(e.target.value)} style={{ width: '100%', padding: '10px' }} />
                                    {companyOptions.length > 0 && (
                                        <ul style={{ position: 'absolute', zIndex: 10, width: '100%', background: 'white', border: '1px solid #ccc', listStyle: 'none', padding: 0, margin: 0, maxHeight: '150px', overflowY: 'auto' }}>
                                            {companyOptions.map(c => (
                                                <li key={c.companyId} onClick={() => handleSelectCompany(c)} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f0f0f0'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
                                                    {c.companyName}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
                        </div>

                        {/* 2. ROUND */}
                        <div>
                            <label style={{ fontWeight: 'bold' }}>2. Select Round</label>
                            <select value={formData.interviewRoundId} onChange={e => setFormData(prev => ({ ...prev, interviewRoundId: e.target.value }))} disabled={!selectedCompany} required style={{ width: '100%', padding: '10px' }}>
                                <option value="">{selectedCompany ? (roundOptions.length === 0 ? "No rounds found for this company" : "-- Select a Round --") : "Pick a company first"}</option>
                                {roundOptions.map(r => (
                                    <option key={r.id} value={r.id}>{r.interviewName} ({r.durationInMinutes} mins)</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

                        {/* 3. STUDENT */}
                        <div style={{ position: 'relative' }}>
                            <label style={{ fontWeight: 'bold' }}>3. Select Student</label>
                            {selectedStudent ? (
                                <div style={{ padding: '10px', border: '1px solid #28a745', borderRadius: '4px', backgroundColor: '#e9f7ef', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>✅ {selectedStudent.name} ({selectedStudent.rollNumber})</span>
                                    <button type="button" onClick={clearStudentSelection} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Change</button>
                                </div>
                            ) : (
                                <>
                                    <input type="text" placeholder="Search by Roll Number..." value={studentSearch} onChange={e => setStudentSearch(e.target.value)} style={{ width: '100%', padding: '10px' }} />
                                    {studentOptions.length > 0 && (
                                        <ul style={{ position: 'absolute', zIndex: 10, width: '100%', background: 'white', border: '1px solid #ccc', listStyle: 'none', padding: 0, margin: 0, maxHeight: '150px', overflowY: 'auto' }}>
                                            {studentOptions.map(s => (
                                                <li key={s.id} onClick={() => handleSelectStudent(s)} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f0f0f0'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
                                                    {s.name} ({s.rollNumber})
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
                        </div>

                        {/* 4. ROOM */}
                        <div style={{ position: 'relative' }}>
                            <label style={{ fontWeight: 'bold' }}>4. Select Room</label>
                            {selectedRoom ? (
                                <div style={{ padding: '10px', border: '1px solid #28a745', borderRadius: '4px', backgroundColor: '#e9f7ef', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>✅ {selectedRoom.roomName} (Cap: {selectedRoom.capacity})</span>
                                    <button type="button" onClick={clearRoomSelection} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Change</button>
                                </div>
                            ) : (
                                <>
                                    <input type="text" placeholder="Search room name..." value={roomSearch} onChange={e => setRoomSearch(e.target.value)} style={{ width: '100%', padding: '10px' }} />
                                    {roomOptions.length > 0 && (
                                        <ul style={{ position: 'absolute', zIndex: 10, width: '100%', background: 'white', border: '1px solid #ccc', listStyle: 'none', padding: 0, margin: 0, maxHeight: '150px', overflowY: 'auto' }}>
                                            {roomOptions.map(r => (
                                                <li key={r.roomId} onClick={() => handleSelectRoom(r)} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f0f0f0'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
                                                    {r.roomName} (Cap: {r.capacity})
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* 5. TIME & STATUS */}
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold' }}>Start Time</label>
                            <input type="datetime-local" value={formData.startTime} onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))} required style={{ width: '100%', padding: '10px' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold' }}>Status</label>
                            <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))} style={{ width: '100%', padding: '10px' }}>
                                <option value="Pending">Pending</option>
                                <option value="InProcess">In Process</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button type="submit" disabled={actionLoading} style={{ padding: '12px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '250px', fontSize: '16px', fontWeight: 'bold' }}>
                            {actionLoading ? "Saving..." : (isEditing ? "Update Schedule" : "Create Schedule")}
                        </button>

                        {/* Cancel button appears when editing */}
                        {isEditing && (
                            <button type="button" onClick={resetForm} disabled={actionLoading} style={{ padding: '12px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* --- LIST SECTION --- */}
            {loading ? <p>Loading schedules...</p> : (
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#eaeaea' }}>
                        <tr>
                            <th style={{ padding: '10px' }}>ID</th>
                            <th>Student</th>
                            <th>Company / Round</th>
                            <th>Room</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map(sch => (
                            <tr key={sch.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{sch.id}</td>
                                <td>{sch.student?.name} ({sch.student?.rollNumber})</td>
                                <td>{sch.interviewRound?.company?.companyName} - {sch.interviewRound?.interviewName}</td>
                                <td>{sch.room?.roomName}</td>
                                <td>{new Date(sch.startTime).toLocaleString()}</td>
                                <td>{sch.status}</td>
                                <td>
                                    {/* Added Edit Button */}
                                    <button onClick={() => handleEditClick(sch)} style={{ marginRight: '10px', color: '#007bff', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
                                    <button onClick={() => handleDelete(sch.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}