import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import useAuth from "../../contexts/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import LoadingSpinner from "../../components/LoadingSpinner";
import Button from "../../components/Button";

export default function UserDashboard() {
    const { user } = useAuth();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    // Top Level Dashboard Mode
    const [dashboardMode, setDashboardMode] = useState('my_schedules'); // 'my_schedules' or 'by_room'

    // My Schedules state
    const [myScheduleType, setMyScheduleType] = useState('active'); // 'active' or 'past'
    const [myInterviews, setMyInterviews] = useState([]);
    const [mySchedulePage, setMySchedulePage] = useState(0);
    const [myScheduleTotalPages, setMyScheduleTotalPages] = useState(1);
    const [loadingMySchedules, setLoadingMySchedules] = useState(false);

    // Room state
    const [rooms, setRooms] = useState([]);
    const [roomPage, setRoomPage] = useState(0);
    const [roomTotalPages, setRoomTotalPages] = useState(1);
    const [loadingRooms, setLoadingRooms] = useState(true);

    // Room Schedule state
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [scheduleType, setScheduleType] = useState('active'); // 'active' or 'past'
    const [interviews, setInterviews] = useState([]);
    const [schedulePage, setSchedulePage] = useState(0);
    const [scheduleTotalPages, setScheduleTotalPages] = useState(1);
    const [loadingSchedules, setLoadingSchedules] = useState(false);

    // Expansion state for cards
    const [expandedCards, setExpandedCards] = useState({});

    const [error, setError] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');
    const [hasNewNotification, setHasNewNotification] = useState(false);

    // Fetch My Schedules
    useEffect(() => {
        if (dashboardMode !== 'my_schedules' || !user?.userId) return;
        fetchMySchedules(myScheduleType, mySchedulePage);
    }, [dashboardMode, myScheduleType, mySchedulePage, user]);

    const fetchMySchedules = async (type, page) => {
        setLoadingMySchedules(true);
        try {
            const endpoint = `/api/student/dashboard/students/${user.userId}/schedules/${type}?page=${page}&size=12`;
            const res = await api.get(endpoint);
            setMyInterviews(res.data.content || []);
            setMyScheduleTotalPages(res.data.totalPages || 1);
        } catch (err) {
            setError(`Failed to load your ${type} schedules.`);
        } finally {
            setLoadingMySchedules(false);
        }
    };

    // Fetch Rooms on Mount or when entering 'by_room' mode
    useEffect(() => {
        if (dashboardMode === 'by_room' && rooms.length === 0) {
            fetchRooms(0);
        }
    }, [dashboardMode, rooms.length]);

    const fetchRooms = async (page) => {
        setLoadingRooms(true);
        try {
            const res = await api.get(`/api/student/dashboard/rooms?page=${page}&size=6`);
            setRooms(res.data.content || []);
            setRoomTotalPages(res.data.totalPages || 1);
            setRoomPage(page);
        } catch (err) {
            setError("Failed to load rooms.");
        } finally {
            setLoadingRooms(false);
        }
    };

    // Fetch Room Schedules when Room or Type or Page changes
    useEffect(() => {
        if (dashboardMode !== 'by_room' || !selectedRoom) return;
        fetchSchedules(selectedRoom.roomId, scheduleType, schedulePage);
    }, [dashboardMode, selectedRoom, scheduleType, schedulePage]);

    const fetchSchedules = async (roomId, type, page) => {
        setLoadingSchedules(true);
        try {
            const endpoint = `/api/student/dashboard/rooms/${roomId}/schedules/${type}?page=${page}&size=12`;
            const res = await api.get(endpoint);
            setInterviews(res.data.content || []);
            setScheduleTotalPages(res.data.totalPages || 1);
        } catch (err) {
            setError(`Failed to load ${type} schedules for room.`);
        } finally {
            setLoadingSchedules(false);
        }
    };

    // SSE Connection
    useEffect(() => {
        if (!user) {
            console.log("No user object found, aborting SSE connection.");
            return;
        }
        
        console.log("Starting SSE connection for user:", user);

        const eventSource = new EventSource(baseUrl + "/api/student/dashboard/stream-updates", { withCredentials: true });

        eventSource.onopen = (event) => {
            console.log("SSE Connection successfully opened!");
            setConnectionStatus('Live');
        };

        eventSource.addEventListener("INIT", (event) => {
            console.log("Received INIT event:", event.data);
            setConnectionStatus('Live');
        });

        eventSource.addEventListener("CREATE_INTERVIEW_SCHEDULE", (event) => {
            try {
                console.log("SSE CREATE event received:", event.data);
                const eventData = JSON.parse(event.data);
                // Backend sends the interview object directly (not wrapped)
                const newInterview = eventData.interviewSchedule ?? eventData;
                if (!newInterview?.id) return;

                if (newInterview.student?.id === user.userId) {
                    setHasNewNotification(true);
                }

                // Update Room schedules
                setInterviews((prev) => {
                    if (dashboardMode === 'by_room' && selectedRoom && newInterview.room?.roomId === selectedRoom.roomId) {
                        if (scheduleType === 'active' && newInterview.status !== 'Completed') {
                            return [newInterview, ...prev];
                        }
                    }
                    return prev;
                });

                // Update My Schedules
                setMyInterviews((prev) => {
                    if (dashboardMode === 'my_schedules' && newInterview.student?.id === user.userId) {
                        if (myScheduleType === 'active' && newInterview.status !== 'Completed') {
                            return [newInterview, ...prev];
                        }
                    }
                    return prev;
                });
            } catch (e) { console.error("Error parsing SSE data", e); }
        });


        eventSource.addEventListener("UPDATE_INTERVIEW_SCHEDULE", (event) => {
            try {
                console.log("SSE UPDATE event received:", event.data);
                const eventData = JSON.parse(event.data);
                // Backend sends the interview object directly (not wrapped)
                const updatedInterview = eventData.interviewSchedule ?? eventData;
                if (!updatedInterview?.id) return;

                if (updatedInterview.student?.id === user.userId) {
                    setHasNewNotification(true);
                }

                // Update Room schedules
                setInterviews((prev) => {
                    if (selectedRoom && updatedInterview.room?.roomId === selectedRoom.roomId) {
                        return prev.map(interview =>
                            interview.id === updatedInterview.id ? updatedInterview : interview
                        );
                    }
                    return prev;
                });

                // Update My Schedules — always update regardless of current view
                setMyInterviews((prev) => {
                    if (updatedInterview.student?.id === user.userId) {
                        return prev.map(interview =>
                            interview.id === updatedInterview.id ? updatedInterview : interview
                        );
                    }
                    return prev;
                });
            } catch (e) { console.error("Error parsing SSE data", e); }
        });


        eventSource.addEventListener("DELETE_INTERVIEW_SCHEDULE", (event) => {
            try {
                console.log("SSE DELETE event received:", event.data);
                const eventData = JSON.parse(event.data);
                // Backend sends the interview object directly (not wrapped)
                const deletedInterview = eventData.interviewSchedule ?? eventData;
                if (!deletedInterview?.id) return;

                if (deletedInterview.student?.id === user.userId) {
                    setHasNewNotification(true);
                }

                // Update Room schedules
                setInterviews((prev) => {
                    if (selectedRoom && deletedInterview.room?.roomId === selectedRoom.roomId) {
                        return prev.filter(interview => interview.id !== deletedInterview.id);
                    }
                    return prev;
                });

                // Update My Schedules
                setMyInterviews((prev) => {
                    if (deletedInterview.student?.id === user.userId) {
                        return prev.filter(interview => interview.id !== deletedInterview.id);
                    }
                    return prev;
                });
            } catch (e) { console.error("Error parsing SSE data", e); }
        });


        eventSource.onerror = (error) => {
            console.error("SSE Connection Error details:", error);
            if (eventSource.readyState === EventSource.CLOSED) {
                console.log("SSE Connection was closed.");
                setConnectionStatus('Disconnected');
            } else if (eventSource.readyState === EventSource.CONNECTING) {
                console.log("SSE Connection is attempting to reconnect...");
                setConnectionStatus('Reconnecting...');
            } else {
                setConnectionStatus('Error');
            }
        };

        return () => {
            eventSource.close();
        };
    }, [baseUrl, selectedRoom, scheduleType, dashboardMode, myScheduleType, user]);

    const toggleExpand = (id) => {
        setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderScheduleCards = (scheduleList, page, totalPages, setPageFn, isMySchedule) => (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {scheduleList.map((interview) => {
                    const isExpanded = expandedCards[interview.id];
                    return (
                        <Card key={interview.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', transition: 'all 0.3s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <h4 className="font-bold text-lg m-0" style={{ color: 'var(--color-text)' }}>
                                    {isMySchedule ? (interview.interviewRound?.company?.companyName || "Unknown") : (interview.student?.name || "Unknown Student")}
                                </h4>
                                <span style={{ 
                                    padding: '0.2rem 0.6rem', 
                                    borderRadius: '999px', 
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    backgroundColor: interview.status === 'Completed' ? '#dcfce7' : interview.status === 'InProcess' ? '#fef9c3' : '#f3f4f6',
                                    color: interview.status === 'Completed' ? '#166534' : interview.status === 'InProcess' ? '#854d0e' : '#374151',
                                }}>
                                    {interview.status || 'Pending'}
                                </span>
                            </div>
                            
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                                🕒 {interview.startTime ? new Date(interview.startTime).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "TBD"}
                            </p>
                            
                            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                                {isMySchedule ? (
                                    <>
                                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 600 }}>{interview.interviewRound?.interviewName}</p>
                                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Room: {interview.room?.roomName}</p>
                                    </>
                                ) : (
                                    <>
                                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 600 }}>{interview.interviewRound?.company?.companyName}</p>
                                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{interview.interviewRound?.interviewName}</p>
                                    </>
                                )}
                            </div>

                            {/* Hidden details that show on expand */}
                            {isExpanded && (
                                <div style={{ backgroundColor: 'var(--color-surface-hover)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginTop: '0.75rem', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    {!isMySchedule && (
                                        <>
                                            <p style={{ margin: 0 }}><strong>Roll Number:</strong> {interview.student?.rollNumber}</p>
                                            <p style={{ margin: 0 }}><strong>Email:</strong> {interview.student?.email}</p>
                                        </>
                                    )}
                                    <p style={{ margin: 0 }}><strong>Duration:</strong> {interview.interviewRound?.durationInMinutes} mins</p>
                                    {isMySchedule && (
                                        <p style={{ margin: 0 }}><strong>Room Capacity:</strong> {interview.room?.capacity}</p>
                                    )}
                                </div>
                            )}

                            <button 
                                onClick={() => toggleExpand(interview.id)}
                                style={{ background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', color: 'var(--color-text)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', textAlign: 'center', width: '100%', marginTop: '0.75rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', transition: 'all 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-border)'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
                            >
                                {isExpanded ? "Hide Details" : "Show Details"}
                            </button>
                        </Card>
                    );
                })}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                    <Button variant="secondary" disabled={page === 0} onClick={() => setPageFn(p => p - 1)}>Prev</Button>
                    <span className="text-sm">Page {page + 1} of {totalPages}</span>
                    <Button variant="secondary" disabled={page >= totalPages - 1} onClick={() => setPageFn(p => p + 1)}>Next</Button>
                </div>
            )}
        </div>
    );

    return (
        <DashboardLayout title="Student Dashboard">
            <div className="flex flex-col gap-6">
                
                {/* Header Card */}
                <Card className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h2 className="text-xl font-bold mb-1">Welcome, {user?.fullName || "Student"}!</h2>
                        <p className="text-muted text-sm">View your personal schedule or explore by room.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {hasNewNotification && (
                            <button 
                                onClick={() => { setDashboardMode('my_schedules'); setHasNewNotification(false); }}
                                style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', border: 'none', borderRadius: 'var(--radius-full)', padding: '0.4rem 1rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239,68,68,0.4)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                <svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                                Schedule Updated
                            </button>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div className={`status-dot ${connectionStatus === 'Live' ? 'status-dot-live' : connectionStatus.startsWith('Reconnecting') ? 'status-dot-connecting' : 'status-dot-error'}`}></div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{connectionStatus}</span>
                        </div>
                    </div>
                </Card>

                {error && (
                    <div className="mb-6 text-error" style={{ padding: '1rem', backgroundColor: 'var(--color-error-bg)', borderRadius: 'var(--radius-md)' }}>
                        {error}
                        <button onClick={() => setError('')} style={{ float: 'right', background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}>✕</button>
                    </div>
                )}

                {/* Main Toggle Navigation */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '1rem' }}>
                    <button 
                        onClick={() => { setDashboardMode('my_schedules'); setExpandedCards({}); }}
                        style={{ 
                            padding: '1rem 2rem', 
                            border: 'none', 
                            background: 'none', 
                            borderBottom: dashboardMode === 'my_schedules' ? '3px solid var(--color-primary)' : '3px solid transparent',
                            color: dashboardMode === 'my_schedules' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            fontWeight: dashboardMode === 'my_schedules' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        👤 My Schedules
                    </button>
                    <button 
                        onClick={() => { setDashboardMode('by_room'); setExpandedCards({}); }}
                        style={{ 
                            padding: '1rem 2rem', 
                            border: 'none', 
                            background: 'none', 
                            borderBottom: dashboardMode === 'by_room' ? '3px solid var(--color-primary)' : '3px solid transparent',
                            color: dashboardMode === 'by_room' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            fontWeight: dashboardMode === 'by_room' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        🏢 Explore By Room
                    </button>
                </div>

                {/* -------------------- MODE: MY SCHEDULES -------------------- */}
                {dashboardMode === 'my_schedules' && (
                    <div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                            <h3 className="font-bold text-lg m-0">Your Interview Itinerary</h3>
                            <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--color-surface-hover)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
                                <button 
                                    onClick={() => { setMyScheduleType('active'); setMySchedulePage(0); }}
                                    style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 500, backgroundColor: myScheduleType === 'active' ? 'var(--color-surface)' : 'transparent', color: myScheduleType === 'active' ? 'var(--color-primary)' : 'var(--color-text-muted)', boxShadow: myScheduleType === 'active' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}
                                >
                                    Active
                                </button>
                                <button 
                                    onClick={() => { setMyScheduleType('past'); setMySchedulePage(0); }}
                                    style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 500, backgroundColor: myScheduleType === 'past' ? 'var(--color-surface)' : 'transparent', color: myScheduleType === 'past' ? 'var(--color-primary)' : 'var(--color-text-muted)', boxShadow: myScheduleType === 'past' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}
                                >
                                    Past
                                </button>
                            </div>
                        </div>

                        {loadingMySchedules ? (
                            <LoadingSpinner message={`Loading your ${myScheduleType} schedules...`} />
                        ) : myInterviews.length === 0 ? (
                            <Card><p className="text-muted text-center" style={{ padding: '3rem 0' }}>You have no {myScheduleType} schedules.</p></Card>
                        ) : (
                            renderScheduleCards(myInterviews, mySchedulePage, myScheduleTotalPages, setMySchedulePage, true)
                        )}
                    </div>
                )}


                {/* -------------------- MODE: BY ROOM -------------------- */}
                {dashboardMode === 'by_room' && (
                    <div>
                        {/* ROOMS GRID */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Available Rooms</h3>
                            {loadingRooms ? (
                                <LoadingSpinner message="Loading rooms..." />
                            ) : rooms.length === 0 ? (
                                <Card><p className="text-muted text-center">No active rooms found.</p></Card>
                            ) : (
                                <div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                                        {rooms.map(room => (
                                            <Card 
                                                key={room.roomId} 
                                                onClick={() => {
                                                    setSelectedRoom(room);
                                                    setSchedulePage(0);
                                                    setScheduleType('active');
                                                    setExpandedCards({}); // Reset expansions on room change
                                                }}
                                                style={{ 
                                                    cursor: 'pointer', 
                                                    transition: 'all 0.2s', 
                                                    border: selectedRoom?.roomId === room.roomId ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                                    backgroundColor: selectedRoom?.roomId === room.roomId ? 'var(--color-primary-light, #eff6ff)' : 'var(--color-surface)',
                                                    transform: selectedRoom?.roomId === room.roomId ? 'translateY(-2px)' : 'none'
                                                }}
                                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                onMouseOut={e => { if (selectedRoom?.roomId !== room.roomId) e.currentTarget.style.transform = 'none' }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <h4 className="font-bold text-lg m-0">{room.roomName}</h4>
                                                    <span style={{ fontSize: '0.875rem', backgroundColor: 'var(--color-surface-hover)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Cap: {room.capacity}</span>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                    {roomTotalPages > 1 && (
                                        <div className="flex justify-between items-center mt-4">
                                            <Button variant="secondary" disabled={roomPage === 0} onClick={() => fetchRooms(roomPage - 1)}>Prev Rooms</Button>
                                            <span className="text-sm">Page {roomPage + 1} of {roomTotalPages}</span>
                                            <Button variant="secondary" disabled={roomPage >= roomTotalPages - 1} onClick={() => fetchRooms(roomPage + 1)}>Next Rooms</Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* SCHEDULES SECTION */}
                        {selectedRoom && (
                            <div style={{ marginTop: '1rem' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                                    <h3 className="font-bold text-lg m-0">
                                        Schedules for <span style={{ color: 'var(--color-primary)' }}>{selectedRoom.roomName}</span>
                                    </h3>
                                    <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--color-surface-hover)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
                                        <button 
                                            onClick={() => { setScheduleType('active'); setSchedulePage(0); }}
                                            style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 500, backgroundColor: scheduleType === 'active' ? 'var(--color-surface)' : 'transparent', color: scheduleType === 'active' ? 'var(--color-primary)' : 'var(--color-text-muted)', boxShadow: scheduleType === 'active' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}
                                        >
                                            Active
                                        </button>
                                        <button 
                                            onClick={() => { setScheduleType('past'); setSchedulePage(0); }}
                                            style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 500, backgroundColor: scheduleType === 'past' ? 'var(--color-surface)' : 'transparent', color: scheduleType === 'past' ? 'var(--color-primary)' : 'var(--color-text-muted)', boxShadow: scheduleType === 'past' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}
                                        >
                                            Past
                                        </button>
                                    </div>
                                </div>

                                {loadingSchedules ? (
                                    <LoadingSpinner message={`Loading ${scheduleType} schedules...`} />
                                ) : interviews.length === 0 ? (
                                    <Card><p className="text-muted text-center" style={{ padding: '2rem 0' }}>No {scheduleType} schedules found for this room.</p></Card>
                                ) : (
                                    renderScheduleCards(interviews, schedulePage, scheduleTotalPages, setSchedulePage, false)
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
