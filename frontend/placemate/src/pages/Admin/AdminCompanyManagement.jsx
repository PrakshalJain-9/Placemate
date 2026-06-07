import { useState, useEffect } from "react";
import { api } from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import Button from "../../components/Button";
import Input from "../../components/Input";

const SearchIcon = () => (
  <svg className="search-bar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
  </svg>
);

const EmptyState = ({ message, sub }) => (
  <div className="empty-state">
    <div className="empty-state-icon">
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
      </svg>
    </div>
    <div className="empty-state-title">{message}</div>
    {sub && <div className="empty-state-sub">{sub}</div>}
  </div>
);

export default function AdminCompanyAndRoundManagement() {
    const [companies, setCompanies] = useState([]);
    const [companyLoading, setCompanyLoading] = useState(false);
    const [companyPage, setCompanyPage] = useState(0);
    const [totalCompanyPages, setTotalCompanyPages] = useState(0);
    const [companySearch, setCompanySearch] = useState('');
    const [companyForm, setCompanyForm] = useState({ companyName: '', version: null });
    const [editingCompanyId, setEditingCompanyId] = useState(null);
    const [companyError, setCompanyError] = useState('');

    // Debounced live search — fires 350ms after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setCompanyPage(0);
            fetchCompanies(companySearch, 0);
        }, 350);
        return () => clearTimeout(timer);
    }, [companySearch]);

    useEffect(() => { fetchCompanies(companySearch, companyPage); }, [companyPage]);

    const fetchCompanies = async (search = companySearch, page = companyPage) => {
        setCompanyLoading(true);
        try {
            const queryParams = { page, size: 8 };
            if (search.trim()) queryParams.companyName = search;
            const res = await api.get("/api/admin/company", { params: queryParams });
            setCompanies(res.data.content || []);
            setTotalCompanyPages(res.data.totalPages || 0);
        } catch (err) {
            console.error("Failed to fetch companies", err);
        } finally { setCompanyLoading(false); }
    };

    const handleCompanySubmit = async (e) => {
        e.preventDefault(); setCompanyError('');
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
                setCompanyError("Conflict: Another user updated this. Please refresh.");
                fetchCompanies();
            } else {
                setCompanyError("Failed to save company. Please try again.");
            }
        }
    };

    const deleteCompany = async (id) => {
        if (!window.confirm("Delete this company and all its rounds?")) return;
        try {
            await api.delete(`/api/admin/company/${id}`);
            fetchCompanies();
        } catch { setCompanyError("Cannot delete — it may have active rounds."); }
    };

    // ── ROUNDS ──────────────────────────────────────────────
    const [rounds, setRounds] = useState([]);
    const [roundLoading, setRoundLoading] = useState(false);
    const [roundPage, setRoundPage] = useState(0);
    const [totalRoundPages, setTotalRoundPages] = useState(0);
    const [roundSearchName, setRoundSearchName] = useState('');
    const [roundSearchCompanyId, setRoundSearchCompanyId] = useState('');
    const [roundForm, setRoundForm] = useState({ interviewName: '', durationInMinutes: '', companyId: '', version: null });
    const [editingRoundId, setEditingRoundId] = useState(null);
    const [roundError, setRoundError] = useState('');

    // Autocomplete for the round FORM's company picker
    const [roundFormCompanySearch, setRoundFormCompanySearch] = useState('');
    const [roundFormCompanyOptions, setRoundFormCompanyOptions] = useState([]);
    const [roundFormSelectedCompany, setRoundFormSelectedCompany] = useState(null);

    // Autocomplete for the round FILTER's company picker
    const [roundFilterCompanySearch, setRoundFilterCompanySearch] = useState('');
    const [roundFilterCompanyOptions, setRoundFilterCompanyOptions] = useState([]);
    const [roundFilterSelectedCompany, setRoundFilterSelectedCompany] = useState(null);

    // Fetch suggestions for round form company picker
    useEffect(() => {
        if (!roundFormCompanySearch.trim()) { setRoundFormCompanyOptions([]); return; }
        const timer = setTimeout(async () => {
            try {
                const res = await api.get('/api/admin/company', { params: { companyName: roundFormCompanySearch, size: 6 } });
                setRoundFormCompanyOptions(res.data.content || []);
            } catch { /* ignore */ }
        }, 300);
        return () => clearTimeout(timer);
    }, [roundFormCompanySearch]);

    // Fetch suggestions for round filter company picker
    useEffect(() => {
        if (!roundFilterCompanySearch.trim()) { setRoundFilterCompanyOptions([]); return; }
        const timer = setTimeout(async () => {
            try {
                const res = await api.get('/api/admin/company', { params: { companyName: roundFilterCompanySearch, size: 6 } });
                setRoundFilterCompanyOptions(res.data.content || []);
            } catch { /* ignore */ }
        }, 300);
        return () => clearTimeout(timer);
    }, [roundFilterCompanySearch]);

    // Debounced live search for rounds
    useEffect(() => {
        const timer = setTimeout(() => {
            setRoundPage(0);
            fetchRounds(roundSearchName, roundSearchCompanyId, 0);
        }, 350);
        return () => clearTimeout(timer);
    }, [roundSearchName, roundSearchCompanyId]);

    useEffect(() => { fetchRounds(roundSearchName, roundSearchCompanyId, roundPage); }, [roundPage]);

    const fetchRounds = async (name = roundSearchName, companyId = roundSearchCompanyId, page = roundPage) => {
        setRoundLoading(true);
        try {
            const queryParams = { page, size: 8 };
            if (name?.trim()) queryParams.interviewName = name;
            if (companyId) queryParams.companyId = companyId;
            const res = await api.get("/api/admin/interview-round", { params: queryParams });
            if (res.data?.content !== undefined) {
                setRounds(res.data.content);
                setTotalRoundPages(res.data.totalPages || 0);
            } else if (Array.isArray(res.data)) {
                setRounds(res.data);
                setTotalRoundPages(1);
            }
        } catch (err) {
            console.error("Failed to fetch rounds", err);
        } finally { setRoundLoading(false); }
    };

    const handleRoundSubmit = async (e) => {
        e.preventDefault(); setRoundError('');
        const payload = {
            interviewName: roundForm.interviewName,
            durationInMinutes: parseInt(roundForm.durationInMinutes),
            companyId: parseInt(roundForm.companyId),
        };
        if (editingRoundId) payload.version = roundForm.version;
        try {
            if (editingRoundId) {
                await api.patch(`/api/admin/interview-round/${editingRoundId}`, payload);
                // After editing: clear everything including company
                setRoundForm({ interviewName: '', durationInMinutes: '', companyId: '', version: null });
                setRoundFormSelectedCompany(null);
                setRoundFormCompanySearch('');
            } else {
                await api.post("/api/admin/interview-round", payload);
                // After creating: keep the company selected so the user can add
                // another round for the same company without re-selecting it.
                // Only clear the round-specific fields; companyId stays intact.
                setRoundForm(prev => ({ ...prev, interviewName: '', durationInMinutes: '', version: null }));
            }
            setEditingRoundId(null);
            fetchRounds();
        } catch (err) {
            if (err.response?.status === 409) {
                setRoundError("Conflict: Another user updated this. Refreshing data.");
                fetchRounds();
            } else {
                setRoundError("Failed to save interview round.");
            }
        }
    };


    const deleteRound = async (id) => {
        if (!window.confirm("Delete this interview round?")) return;
        try {
            await api.delete(`/api/admin/interview-round/${id}`);
            fetchRounds();
        } catch { setRoundError("Failed to delete interview round."); }
    };

    const selectCompanyForRound = (company) => {
        // Pre-fill the form autocomplete with the selected company
        setRoundFormSelectedCompany(company);
        setRoundFormCompanySearch('');
        setRoundFormCompanyOptions([]);
        setRoundForm(prev => ({ ...prev, companyId: company.companyId }));
        // Also apply it as a filter so the rounds list shows only this company's rounds
        setRoundFilterSelectedCompany(company);
        setRoundSearchCompanyId(String(company.companyId));
        setRoundPage(0);
        document.getElementById('rounds-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <DashboardLayout title="Company & Round Management">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* ── COMPANIES SECTION ── */}
                <div className="panel-grid">
                    {/* Form */}
                    <div className="panel-form">
                        <div className="card">
                            <div className="form-panel-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 'var(--radius-md)',
                                        background: 'var(--color-primary-light)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-primary)" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="form-panel-title">{editingCompanyId ? 'Edit Company' : 'New Company'}</div>
                                        <div className="form-panel-subtitle">{editingCompanyId ? 'Update company details' : 'Add a recruiting company'}</div>
                                    </div>
                                </div>
                            </div>

                            {companyError && <div className="alert alert-error">{companyError}</div>}

                            <form onSubmit={handleCompanySubmit}>
                                <Input
                                    label="Company Name"
                                    value={companyForm.companyName}
                                    onChange={e => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                                    placeholder="e.g. Google, Microsoft..."
                                    required
                                />
                                <div className="flex gap-2 mt-4">
                                    <Button type="submit" style={{ flex: 1 }}>
                                        {editingCompanyId ? 'Update Company' : 'Add Company'}
                                    </Button>
                                    {editingCompanyId && (
                                        <Button type="button" variant="secondary" onClick={() => {
                                            setEditingCompanyId(null);
                                            setCompanyForm({ companyName: '', version: null });
                                            setCompanyError('');
                                        }}>Cancel</Button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* List */}
                    <div>
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <div className="section-title">Companies</div>
                                    <div className="section-subtitle">{companies.length} companies found</div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <div className="search-bar" style={{ minWidth: 200 }}>
                                        <SearchIcon />
                                        <input
                                            className="input-field"
                                            value={companySearch}
                                            onChange={e => setCompanySearch(e.target.value)}
                                            placeholder="Search companies..."
                                            style={{ paddingLeft: '2.5rem' }}
                                        />
                                    </div>
                                    {companySearch && (
                                        <Button type="button" variant="secondary" size="sm" onClick={() => setCompanySearch('')}>Clear</Button>
                                    )}
                                </div>
                            </div>

                            {companyLoading ? (
                                <div className="spinner-container"><div className="spinner" /></div>
                            ) : companies.length === 0 ? (
                                <EmptyState message="No companies yet" sub="Add your first recruiting company using the form." />
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Company Name</th>
                                            <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {companies.map(c => (
                                            <tr key={c.companyId}>
                                                <td className="cell-muted" style={{ width: 60 }}>{c.companyId}</td>
                                                <td className="cell-primary">{c.companyName}</td>
                                                <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                        <Button
                                                            variant="secondary" size="sm"
                                                            onClick={() => selectCompanyForRound(c)}
                                                            style={{ color: '#059669', borderColor: '#a7f3d0', background: '#ecfdf5' }}
                                                        >
                                                            + Add Round
                                                        </Button>
                                                        <Button
                                                            variant="secondary" size="sm"
                                                            onClick={() => { setEditingCompanyId(c.companyId); setCompanyForm({ companyName: c.companyName, version: c.version }); setCompanyError(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                        >Edit</Button>
                                                        <Button
                                                            variant="danger" size="sm"
                                                            onClick={() => deleteCompany(c.companyId)}
                                                        >Delete</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {!companyLoading && companies.length > 0 && (
                                <div className="pagination">
                                    <Button variant="secondary" size="sm" disabled={companyPage === 0} onClick={() => setCompanyPage(p => p - 1)}>← Prev</Button>
                                    <span className="pagination-info">Page {companyPage + 1} of {Math.max(1, totalCompanyPages)}</span>
                                    <Button variant="secondary" size="sm" disabled={companyPage >= totalCompanyPages - 1} onClick={() => setCompanyPage(p => p + 1)}>Next →</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <hr className="divider" />

                {/* ── ROUNDS SECTION ── */}
                <div id="rounds-section" className="panel-grid">
                    {/* Form */}
                    <div className="panel-form">
                        <div className="card">
                            <div className="form-panel-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 'var(--radius-md)',
                                        background: '#ede9fe',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#7c3aed" strokeWidth={2}>
                                            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="form-panel-title">{editingRoundId ? 'Edit Round' : 'New Interview Round'}</div>
                                        <div className="form-panel-subtitle">{editingRoundId ? 'Update round details' : 'Define a new interview round'}</div>
                                    </div>
                                </div>
                            </div>

                            {roundError && <div className="alert alert-error">{roundError}</div>}

                            <form onSubmit={handleRoundSubmit}>
                                <Input
                                    label="Round Name"
                                    value={roundForm.interviewName}
                                    onChange={e => setRoundForm({ ...roundForm, interviewName: e.target.value })}
                                    placeholder="e.g. Technical Interview"
                                    required
                                />
                                <Input
                                    label="Duration (minutes)"
                                    type="number"
                                    value={roundForm.durationInMinutes}
                                    onChange={e => setRoundForm({ ...roundForm, durationInMinutes: e.target.value })}
                                    placeholder="e.g. 60"
                                    required
                                />
                                {/* Company autocomplete picker */}
                                <div className="form-group">
                                    <label className="form-label">Company</label>
                                    {roundFormSelectedCompany ? (
                                        <div className="selected-tag">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <svg width="14" height="14" fill="var(--color-primary)" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                <span className="selected-tag-text">{roundFormSelectedCompany.companyName}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="selected-tag-change"
                                                onClick={() => {
                                                    setRoundFormSelectedCompany(null);
                                                    setRoundFormCompanySearch('');
                                                    setRoundForm(prev => ({ ...prev, companyId: '' }));
                                                }}
                                            >Change</button>
                                        </div>
                                    ) : (
                                        <div className="autocomplete-wrapper">
                                            <input
                                                className="input-field"
                                                type="text"
                                                value={roundFormCompanySearch}
                                                onChange={e => setRoundFormCompanySearch(e.target.value)}
                                                placeholder="Type to search a company..."
                                            />
                                            {roundFormCompanyOptions.length > 0 && (
                                                <ul className="autocomplete-dropdown">
                                                    {roundFormCompanyOptions.map(c => (
                                                        <li
                                                            key={c.companyId}
                                                            className="autocomplete-item"
                                                            onClick={() => {
                                                                setRoundFormSelectedCompany(c);
                                                                setRoundForm(prev => ({ ...prev, companyId: c.companyId }));
                                                                setRoundFormCompanySearch('');
                                                                setRoundFormCompanyOptions([]);
                                                            }}
                                                        >
                                                            {c.companyName}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Button type="submit" style={{ flex: 1 }}>
                                        {editingRoundId ? 'Update Round' : 'Add Round'}
                                    </Button>
                                    {editingRoundId && (
                                        <Button type="button" variant="secondary" onClick={() => {
                                            setEditingRoundId(null);
                                            setRoundForm({ interviewName: '', durationInMinutes: '', companyId: '', version: null });
                                            setRoundFormSelectedCompany(null);
                                            setRoundFormCompanySearch('');
                                            setRoundError('');
                                        }}>Cancel</Button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* List */}
                    <div>
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <div className="section-title">Interview Rounds</div>
                                    <div className="section-subtitle">{rounds.length} rounds found</div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <div className="search-bar" style={{ minWidth: 160 }}>
                                        <SearchIcon />
                                        <input className="input-field" value={roundSearchName} onChange={e => setRoundSearchName(e.target.value)} placeholder="Round name..." style={{ paddingLeft: '2.5rem' }} />
                                    </div>
                                    {/* Company name autocomplete filter */}
                                    {roundFilterSelectedCompany ? (
                                        <div className="selected-tag" style={{ padding: '0.4rem 0.75rem' }}>
                                            <span className="selected-tag-text" style={{ fontSize: '0.8rem' }}>{roundFilterSelectedCompany.companyName}</span>
                                            <button
                                                type="button"
                                                className="selected-tag-change"
                                                onClick={() => {
                                                    setRoundFilterSelectedCompany(null);
                                                    setRoundFilterCompanySearch('');
                                                    setRoundSearchCompanyId('');
                                                }}
                                            >✕</button>
                                        </div>
                                    ) : (
                                        <div className="autocomplete-wrapper" style={{ minWidth: 160 }}>
                                            <input
                                                className="input-field"
                                                type="text"
                                                value={roundFilterCompanySearch}
                                                onChange={e => setRoundFilterCompanySearch(e.target.value)}
                                                placeholder="Filter by company..."
                                            />
                                            {roundFilterCompanyOptions.length > 0 && (
                                                <ul className="autocomplete-dropdown">
                                                    {roundFilterCompanyOptions.map(c => (
                                                        <li
                                                            key={c.companyId}
                                                            className="autocomplete-item"
                                                            onClick={() => {
                                                                setRoundFilterSelectedCompany(c);
                                                                setRoundSearchCompanyId(String(c.companyId));
                                                                setRoundFilterCompanySearch('');
                                                                setRoundFilterCompanyOptions([]);
                                                            }}
                                                        >
                                                            {c.companyName}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                    {(roundSearchName || roundSearchCompanyId) && (
                                        <Button type="button" variant="secondary" size="sm" onClick={() => {
                                            setRoundSearchName('');
                                            setRoundSearchCompanyId('');
                                            setRoundFilterSelectedCompany(null);
                                            setRoundFilterCompanySearch('');
                                        }}>Clear All</Button>
                                    )}
                                </div>
                            </div>

                            {roundLoading ? (
                                <div className="spinner-container"><div className="spinner" /></div>
                            ) : rounds.length === 0 ? (
                                <EmptyState message="No interview rounds" sub="Click '+ Add Round' on a company, or use the form above." />
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Round Name</th>
                                            <th>Duration</th>
                                            <th>Company</th>
                                            <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rounds.map(r => (
                                            <tr key={r.id}>
                                                <td className="cell-muted" style={{ width: 60 }}>{r.id}</td>
                                                <td className="cell-primary">{r.interviewName}</td>
                                                <td>
                                                    <span className="badge badge-blue">{r.durationInMinutes}m</span>
                                                </td>
                                                <td>{r.company ? r.company.companyName : <span className="text-muted">N/A</span>}</td>
                                                <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                        <Button
                                                            variant="secondary" size="sm"
                                                            onClick={() => {
                                                                setEditingRoundId(r.id);
                                                                setRoundForm({ interviewName: r.interviewName, durationInMinutes: r.durationInMinutes, companyId: r.company?.companyId || '', version: r.version });
                                                                // Pre-fill the company autocomplete picker
                                                                if (r.company) {
                                                                    setRoundFormSelectedCompany(r.company);
                                                                    setRoundFormCompanySearch('');
                                                                } else {
                                                                    setRoundFormSelectedCompany(null);
                                                                }
                                                                setRoundError('');
                                                                document.getElementById('rounds-section')?.scrollIntoView({ behavior: 'smooth' });
                                                            }}
                                                        >Edit</Button>
                                                        <Button variant="danger" size="sm" onClick={() => deleteRound(r.id)}>Delete</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {!roundLoading && rounds.length > 0 && (
                                <div className="pagination">
                                    <Button variant="secondary" size="sm" disabled={roundPage === 0} onClick={() => setRoundPage(p => p - 1)}>← Prev</Button>
                                    <span className="pagination-info">Page {roundPage + 1} of {Math.max(1, totalRoundPages)}</span>
                                    <Button variant="secondary" size="sm" disabled={roundPage >= totalRoundPages - 1} onClick={() => setRoundPage(p => p + 1)}>Next →</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}