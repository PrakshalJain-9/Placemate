import { useState, useEffect } from "react";
import { api } from "../../api/axios";

export default function AdminCompanyAndRoundManagement() {
    // ==========================================
    // 1. COMPANY STATE & LOGIC
    // ==========================================
    const [companies, setCompanies] = useState([]);
    const [companyLoading, setCompanyLoading] = useState(false);
    const [companyPage, setCompanyPage] = useState(0);
    const [totalCompanyPages, setTotalCompanyPages] = useState(0);

    const [companySearch, setCompanySearch] = useState('');
    const [activeCompanySearch, setActiveCompanySearch] = useState('');

    const [companyForm, setCompanyForm] = useState({ companyName: '', version: null });
    const [editingCompanyId, setEditingCompanyId] = useState(null);

    useEffect(() => {
        fetchCompanies();
    }, [companyPage, activeCompanySearch]);

    const fetchCompanies = async () => {
        setCompanyLoading(true);
        try {
            // THE FIX: Dynamically build query params to prevent 400 Bad Request
            const queryParams = {
                page: companyPage,
                size: 5
            };
            
            // Only attach companyName if it actually has text
            if (activeCompanySearch.trim() !== "") {
                queryParams.companyName = activeCompanySearch;
            }

            const res = await api.get("/api/admin/company", { params: queryParams });
            
            setCompanies(res.data.content);
            setTotalCompanyPages(res.data.totalPages);
        } catch (err) {
            console.error("Failed to fetch companies", err);
        } finally {
            setCompanyLoading(false);
        }
    };

    const handleCompanySubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCompanyId) {
                await api.patch(`/api/admin/company/${editingCompanyId}`, companyForm);
            } else {
                await api.post("/api/admin/company", { companyName: companyForm.companyName });
            }
            
            setCompanyForm({ companyName: '', version: null });
            setEditingCompanyId(null);
            fetchCompanies();
        } catch (err) {
            if (err.response?.status === 409) {
                alert("Another user updated this company. Please refresh and try again.");
                fetchCompanies(); 
            } else {
                alert("Failed to save company");
            }
        }
    };

    const deleteCompany = async (id) => {
        if (!window.confirm("Delete this company?")) return;
        try {
            await api.delete(`/api/admin/company/${id}`);
            fetchCompanies();
        } catch (err) {
            alert("Cannot delete. It may have active interview rounds.");
        }
    };

    // ==========================================
    // 2. INTERVIEW ROUND STATE & LOGIC
    // ==========================================
    const [rounds, setRounds] = useState([]);
    const [roundLoading, setRoundLoading] = useState(false);
    const [roundPage, setRoundPage] = useState(0);
    const [totalRoundPages, setTotalRoundPages] = useState(0);

    const [roundSearchName, setRoundSearchName] = useState('');
    const [roundSearchCompanyId, setRoundSearchCompanyId] = useState('');
    const [activeRoundFilters, setActiveRoundFilters] = useState({ name: '', companyId: '' });

    const [roundForm, setRoundForm] = useState({ interviewName: '', durationInMinutes: '', companyId: '', version: null });
    const [editingRoundId, setEditingRoundId] = useState(null);

    useEffect(() => {
        fetchRounds();
    }, [roundPage, activeRoundFilters]);

   const fetchRounds = async () => {
        setRoundLoading(true);
        try {
            const queryParams = {
                page: roundPage,
                size: 5
            };

            if (activeRoundFilters.name && activeRoundFilters.name.trim() !== "") {
                queryParams.interviewName = activeRoundFilters.name;
            }
            if (activeRoundFilters.companyId && activeRoundFilters.companyId !== "") {
                queryParams.companyId = activeRoundFilters.companyId;
            }

            console.log("👉 1. React is sending these params to Spring:", queryParams);

            const res = await api.get("/api/admin/interview-round", { params: queryParams });
            
            console.log("👉 2. Spring Boot replied with this full payload:", res.data);

            // DIAGNOSTIC CHECK: Determine the correct structure
            if (res.data && res.data.content !== undefined) {
                // It's a standard Spring Page
                console.log("👉 3. Found Spring Page data! Setting rounds:", res.data.content);
                setRounds(res.data.content);
                setTotalRoundPages(res.data.totalPages || 0);
            } else if (Array.isArray(res.data)) {
                // The backend sent a raw List instead of a Page!
                console.log("👉 3. Found a raw List! Setting rounds:", res.data);
                setRounds(res.data);
                setTotalRoundPages(1); // Fake it since Lists don't have pages
            } else {
                console.error("🚨 3. Unrecognized data structure from backend!", res.data);
            }

        } catch (err) {
            console.error("🚨 Failed to fetch rounds. Details:", err.response || err);
        } finally {
            setRoundLoading(false);
        }
    };

    const handleRoundSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            interviewName: roundForm.interviewName,
            durationInMinutes: parseInt(roundForm.durationInMinutes),
            companyId: parseInt(roundForm.companyId)
        };

        if (editingRoundId) {
            payload.version = roundForm.version;
        }

        try {
            if (editingRoundId) {
                await api.patch(`/api/admin/interview-round/${editingRoundId}`, payload);
            } else {
                await api.post("/api/admin/interview-round", payload);
            }
            
            setRoundForm({ interviewName: '', durationInMinutes: '', companyId: '', version: null });
            setEditingRoundId(null);
            fetchRounds();
        } catch (err) {
            if (err.response?.status === 409) {
                alert("Another user updated this interview round. Please refresh and try again.");
                fetchRounds(); 
            } else {
                alert("Failed to save interview round");
            }
        }
    };

    const deleteRound = async (id) => {
        if (!window.confirm("Delete this interview round?")) return;
        try {
            await api.delete(`/api/admin/interview-round/${id}`);
            fetchRounds();
        } catch (err) {
            alert("Failed to delete interview round.");
        }
    };

    const selectCompanyForRound = (companyId) => {
        setRoundForm(prev => ({ ...prev, companyId: companyId }));
        setRoundSearchCompanyId(companyId);
        setActiveRoundFilters({ name: activeRoundFilters.name, companyId: companyId });
        setRoundPage(0);
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    // ==========================================
    // RENDER UI
    // ==========================================
    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>

            {/* SECTION 1: COMPANIES */}
            <section style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <h2>🏢 Company Management</h2>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <form onSubmit={(e) => { e.preventDefault(); setActiveCompanySearch(companySearch); setCompanyPage(0); }}>
                        <input value={companySearch} onChange={e => setCompanySearch(e.target.value)} placeholder="Search companies..." style={{ padding: '8px' }} />
                        <button type="submit">Search</button>
                        <button type="button" onClick={() => { setCompanySearch(''); setActiveCompanySearch(''); setCompanyPage(0); }}>Clear</button>
                    </form>

                    <form onSubmit={handleCompanySubmit} style={{ display: 'flex', gap: '10px', borderLeft: '2px solid #ccc', paddingLeft: '20px' }}>
                        <input value={companyForm.companyName} onChange={e => setCompanyForm({ ...companyForm, companyName: e.target.value })} placeholder="New Company Name" required style={{ padding: '8px' }} />
                        <button type="submit">{editingCompanyId ? "Update Company" : "Add Company"}</button>
                        {editingCompanyId && <button type="button" onClick={() => { setEditingCompanyId(null); setCompanyForm({ companyName: '', version: null }); }}>Cancel</button>}
                    </form>
                </div>

                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#eaeaea' }}>
                        <tr>
                            <th style={{ padding: '10px' }}>ID</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map(c => (
                            <tr key={c.companyId} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{c.companyId}</td>
                                <td>{c.companyName}</td>
                                <td>
                                    <button onClick={() => { 
                                        setEditingCompanyId(c.companyId); 
                                        setCompanyForm({ companyName: c.companyName, version: c.version }); 
                                    }}>Edit</button>
                                    
                                    <button onClick={() => deleteCompany(c.companyId)} style={{ color: 'red', margin: '0 10px' }}>Delete</button>
                                    <button onClick={() => selectCompanyForRound(c.companyId)} style={{ backgroundColor: '#28a745', color: 'white' }}>➕ Add Round</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <button disabled={companyPage === 0} onClick={() => setCompanyPage(p => p - 1)}>Prev</button>
                    <span style={{ margin: '0 10px' }}>Page {companyPage + 1} of {Math.max(1, totalCompanyPages)}</span>
                    <button disabled={companyPage >= totalCompanyPages - 1} onClick={() => setCompanyPage(p => p + 1)}>Next</button>
                </div>
            </section>

            {/* SECTION 2: INTERVIEW ROUNDS */}
            <section style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff' }}>
                <h2>📋 Interview Round Management</h2>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        setActiveRoundFilters({ name: roundSearchName, companyId: roundSearchCompanyId });
                        setRoundPage(0);
                    }}>
                        <input value={roundSearchName} onChange={e => setRoundSearchName(e.target.value)} placeholder="Search by Round Name" style={{ padding: '8px' }} />
                        <input type="number" value={roundSearchCompanyId} onChange={e => setRoundSearchCompanyId(e.target.value)} placeholder="Filter by Company ID" style={{ padding: '8px', marginLeft: '5px' }} />
                        <button type="submit">Filter Rounds</button>
                        <button type="button" onClick={() => {
                            setRoundSearchName(''); setRoundSearchCompanyId('');
                            setActiveRoundFilters({ name: '', companyId: '' });
                            setRoundPage(0);
                        }}>Clear Filters</button>
                    </form>

                    <form onSubmit={handleRoundSubmit} style={{ display: 'flex', gap: '10px', borderLeft: '2px solid #ccc', paddingLeft: '20px', flexWrap: 'wrap' }}>
                        <input value={roundForm.interviewName} onChange={e => setRoundForm({ ...roundForm, interviewName: e.target.value })} placeholder="Round Name" required style={{ padding: '8px' }} />
                        <input type="number" value={roundForm.durationInMinutes} onChange={e => setRoundForm({ ...roundForm, durationInMinutes: e.target.value })} placeholder="Duration (mins)" required style={{ padding: '8px', width: '120px' }} />
                        <input type="number" value={roundForm.companyId} onChange={e => setRoundForm({ ...roundForm, companyId: e.target.value })} placeholder="Company ID" required style={{ padding: '8px', width: '100px' }} />

                        <button type="submit">{editingRoundId ? "Update Round" : "Add Round"}</button>
                        {editingRoundId && <button type="button" onClick={() => { setEditingRoundId(null); setRoundForm({ interviewName: '', durationInMinutes: '', companyId: '', version: null }); }}>Cancel</button>}
                    </form>
                </div>

                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#eaeaea' }}>
                        <tr>
                            <th style={{ padding: '10px' }}>ID</th>
                            <th>Round Name</th>
                            <th>Duration (m)</th>
                            <th>Company</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rounds.map(r => (
                            <tr key={r.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{r.id}</td>
                                <td>{r.interviewName}</td>
                                <td>{r.durationInMinutes}</td>
                                <td>{r.company ? `${r.company.companyName} (ID: ${r.company.companyId})` : "N/A"}</td>
                                <td>
                                    <button onClick={() => {
                                        setEditingRoundId(r.id);
                                        setRoundForm({ 
                                            interviewName: r.interviewName, 
                                            durationInMinutes: r.durationInMinutes, 
                                            companyId: r.company?.companyId || '',
                                            version: r.version 
                                        });
                                    }}>Edit</button>
                                    
                                    <button onClick={() => deleteRound(r.id)} style={{ color: 'red', marginLeft: '10px' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <button disabled={roundPage === 0} onClick={() => setRoundPage(p => p - 1)}>Prev</button>
                    <span style={{ margin: '0 10px' }}>Page {roundPage + 1} of {Math.max(1, totalRoundPages)}</span>
                    <button disabled={roundPage >= totalRoundPages - 1} onClick={() => setRoundPage(p => p + 1)}>Next</button>
                </div>
            </section>
        </div>
    );
}