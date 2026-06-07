import { useState, useEffect } from "react";
import { api } from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import Button from "../../components/Button";
import Input from "../../components/Input";
import LoadingSpinner from "../../components/LoadingSpinner";

const RoomIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
);

export default function AdminRoomManagement() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [currentRoomVersion, setCurrentRoomVersion] = useState(null);
    const [formData, setFormData] = useState({ roomName: '', capacity: '' });

    useEffect(() => { fetchRooms(); }, []);

    const fetchRooms = async () => {
        try {
            const response = await api.get("/api/admin/room", { params: { size: 100 } });
            setRooms(response.data.content || response.data || []);
        } catch (err) {
            setError("Failed to load rooms.");
        } finally { setLoading(false); }
    };

    const resetForm = () => {
        setFormData({ roomName: '', capacity: '' });
        setIsEditing(false);
        setCurrentRoomId(null);
        setCurrentRoomVersion(null);
        setError('');
    };

    const handleEditClick = (room) => {
        setIsEditing(true);
        setCurrentRoomId(room.roomId);
        setCurrentRoomVersion(room.version);
        setFormData({ roomName: room.roomName, capacity: room.capacity });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true); setError('');
        try {
            if (isEditing) {
                const payload = { ...formData, version: currentRoomVersion };
                const response = await api.put(`/api/admin/room/${currentRoomId}`, payload);
                setRooms(prev => prev.map(r => r.roomId === currentRoomId ? response.data : r));
            } else {
                const response = await api.post("/api/admin/room", formData);
                setRooms(prev => [...prev, response.data]);
            }
            resetForm();
        } catch {
            setError(isEditing ? "Failed to update room." : "Failed to create room.");
        } finally { setActionLoading(false); }
    };

    const handleDelete = async (roomId) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;
        try {
            await api.delete(`/api/admin/room/${roomId}`);
            setRooms(prev => prev.filter(r => r.roomId !== roomId));
        } catch { setError("Failed to delete room — it might be in use."); }
    };

    if (loading) {
        return (
            <DashboardLayout title="Room Management">
                <LoadingSpinner message="Loading rooms..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Room Management">
            <div className="panel-grid">
                {/* ── Form ── */}
                <div className="panel-form">
                    <div className="card">
                        <div className="form-panel-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 'var(--radius-md)',
                                    background: 'var(--color-primary-light)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--color-primary)'
                                }}>
                                    <RoomIcon />
                                </div>
                                <div>
                                    <div className="form-panel-title">{isEditing ? 'Edit Room' : 'New Room'}</div>
                                    <div className="form-panel-subtitle">{isEditing ? 'Update room details' : 'Add an interview room'}</div>
                                </div>
                            </div>
                        </div>

                        {error && <div className="alert alert-error">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <Input
                                label="Room Name"
                                name="roomName"
                                value={formData.roomName}
                                onChange={e => setFormData(p => ({ ...p, roomName: e.target.value }))}
                                placeholder="e.g. Hall A-101"
                                required
                            />
                            <Input
                                label="Capacity"
                                name="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={e => setFormData(p => ({ ...p, capacity: e.target.value }))}
                                placeholder="e.g. 50"
                                required
                            />
                            <div className="flex gap-2 mt-4">
                                <Button type="submit" disabled={actionLoading} style={{ flex: 1 }}>
                                    {actionLoading ? 'Saving...' : isEditing ? 'Update Room' : 'Create Room'}
                                </Button>
                                {isEditing && (
                                    <Button type="button" variant="secondary" onClick={resetForm} disabled={actionLoading}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Stats card */}
                    <div className="card" style={{ marginTop: '1.25rem', background: 'linear-gradient(135deg, var(--color-primary) 0%, #8b5cf6 100%)', border: 'none', color: 'white' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Total Rooms</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{rooms.length}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.25rem' }}>
                            {rooms.reduce((acc, r) => acc + (parseInt(r.capacity) || 0), 0)} total seats
                        </div>
                    </div>
                </div>

                {/* ── List ── */}
                <div>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                            <div className="section-title">Interview Rooms</div>
                            <div className="section-subtitle">Click any row to edit</div>
                        </div>

                        {rooms.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon"><RoomIcon /></div>
                                <div className="empty-state-title">No rooms yet</div>
                                <div className="empty-state-sub">Add your first interview room using the form.</div>
                            </div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Room Name</th>
                                        <th>Capacity</th>
                                        <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map(room => (
                                        <tr key={room.roomId} style={{ cursor: 'pointer' }} onClick={() => handleEditClick(room)}>
                                            <td className="cell-muted" style={{ width: 60 }}>{room.roomId}</td>
                                            <td className="cell-primary">{room.roomName}</td>
                                            <td>
                                                <span className="badge badge-purple">{room.capacity} seats</span>
                                            </td>
                                            <td style={{ textAlign: 'right', paddingRight: '1.5rem' }} onClick={e => e.stopPropagation()}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <Button
                                                        variant="secondary" size="sm"
                                                        onClick={() => handleEditClick(room)}
                                                    >Edit</Button>
                                                    <Button
                                                        variant="danger" size="sm"
                                                        onClick={() => handleDelete(room.roomId)}
                                                    >Delete</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}