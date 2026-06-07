import { useState, useEffect } from "react";
import { api } from "../../api/axios"; // Adjust path to your axios instance
import useAuth from "../../contexts/AuthContext";

export default function AdminRoomManagement() {
    // --- State Management ---
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [currentRoomVersion, setCurrentRoomVersion] = useState(null);
    const [formData, setFormData] = useState({
        roomName: '',
        capacity: ''
    });

    const { user } = useAuth();
    // --- 1. READ (Fetch all rooms on mount) ---
    useEffect(() => {
        console.log(user);
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            // Maps to @GetMapping("/admin/allrooms")
            const response = await api.get("/api/admin/allrooms");
            setRooms(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load rooms.");
        } finally {
            setLoading(false);
        }
    };

    // --- Form Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
        console.log(room);
        setCurrentRoomId(room.roomId); // Assuming your room object has an 'id'
        setCurrentRoomVersion(room.version);
        setFormData({
            roomName: room.roomName,
            capacity: room.capacity
        });
        window.scrollTo(0, 0); // Scroll to form
    };

    // --- 2. CREATE & 4. UPDATE (Handle form submission) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setError('');

        try {
            if (isEditing) {
                // Maps to @PutMapping("/admin/room/{id}")
                const payload = { ...formData, version: currentRoomVersion };
                const response = await api.put(`/api/admin/room/${currentRoomId}`, payload);

                // Update the state immutably (The lesson from SSE!)
                setRooms(prev => prev.map(room =>
                    room.roomId === currentRoomId ? response.data : room
                ));
            } else {
                // Maps to @PostMapping("/admin/room")
                const response = await api.post("/api/admin/room", formData);

                // Append the new room to state without refreshing the page
                setRooms(prev => [...prev, response.data]);
            }
            resetForm();
        } catch (err) {
            console.error(err);
            setError(isEditing ? "Failed to update room." : "Failed to create room.");
        } finally {
            setActionLoading(false);
        }
    };

    // --- 3. DELETE ---
    const handleDelete = async (roomId) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;

        try {
            // Maps to @DeleteMapping("/admin/room/{id}")
            await api.delete(`/api/admin/room/${roomId}`);

            // Remove from state immutably using filter
            setRooms(prev => prev.filter(room => room.roomId !== roomId));
        } catch (err) {
            console.error(err);
            setError("Failed to delete room. It might be in use.");
        }
    };

    // --- UI Render ---
    if (loading) return <div>Loading room data...</div>;

    return (
        <div className="admin-room-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Admin Room Management</h2>

            {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

            {/* --- FORM SECTION --- */}
            <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '30px', borderRadius: '8px' }}>
                <h3>{isEditing ? "Edit Room" : "Add New Room"}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

                    {/* Make sure these 'name' attributes perfectly match your DTO fields! */}
                    <input
                        name="roomName"
                        value={formData.roomName}
                        onChange={handleInputChange}
                        placeholder="Room Name (e.g. A-101)"
                        required
                    />

                    <input
                        name="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        placeholder="Capacity"
                        required
                    />

                    <button type="submit" disabled={actionLoading}>
                        {actionLoading ? "Saving..." : (isEditing ? "Update Room" : "Create Room")}
                    </button>

                    {isEditing && (
                        <button type="button" onClick={resetForm} disabled={actionLoading}>
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            {/* --- LIST SECTION --- */}
            <div className="room-list">
                <h3>Current Rooms</h3>
                {rooms.length === 0 ? (
                    <p>No rooms found for this college.</p>
                ) : (
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #000' }}>
                                <th>Room ID</th>
                                <th>Name</th>
                                <th>Capacity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map(room => (
                                <tr key={room.roomId} style={{ borderBottom: '1px solid #eee' }}>
                                    <td>{room.roomId}</td>
                                    <td>{room.roomName}</td>
                                    <td>{room.capacity}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(room)} style={{ marginRight: '10px' }}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(room.roomId)} style={{ color: 'red' }}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}