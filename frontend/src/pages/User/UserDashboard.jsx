import { useEffect } from "react";
import useAuth from "../../contexts/AuthContext";
import { api } from "../../api/axios";
import { useState } from "react";

export default function UserDashboard() {
    const { user, logout } = useAuth();

    const [interviews, setInterviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const baseUrl = import.meta.env.VITE_API_BASE_URL


    useEffect(() => {
        const eventSource = new EventSource(baseUrl + "/api/student/stream-updates", { withCredentials: true }); // here we get a sseEmitter from the backend with data in init parameter
        setIsLoading(false);


        eventSource.addEventListener("INIT", (event) => {
            console.log("I am in");
            console.log(event);
            const initialData = JSON.parse(event.data);
            setInterviews(initialData.interviewSchedules);
        });



        eventSource.addEventListener("CREATE_INTERVIEW_SCHEDULE", (event) => {
            const newInterview = JSON.parse(event.data);
            console.log("I am create interview " + newInterview);
            setInterviews((prevInterviews) => [...prevInterviews, newInterview]);
        });


        eventSource.onerror = (error) => {
            console.error("SSE Connection dropped. Reconnecting...", error);
            setError("Live connection lost. Attempting to reconnect...");
        };


        eventSource.addEventListener("UPDATE_INTERVIEW_SCHEDULE", (event) => {
            const updatedInterview = JSON.parse(event.data);
            setInterviews(prev => {
                return prev.map(interview => {
                    if (interview.id === updatedInterview.id) return updatedInterview;
                    else return interview;
                })
            })
        });

        eventSource.addEventListener("DELETE_INTERVIEW_SCHEDULE", (event) => {
            const deletedInterview = JSON.parse(event.data);
            console.log("I am deleted Interview" + deletedInterview);
            setInterviews(prev => {
                return prev.filter((interview) => {
                    if (interview.id !== deletedInterview.id) return true;
                    return false;
                })
            })
        })

        return () => {
            console.log("Closing SSE connection...");
            eventSource.close();
        };

    }, [user]);


    if (isLoading) return <div>Loading your schedule...</div>;


    return (
        <div className="dashboard-container">
            <h1>Welcome, {user.name}</h1>
            {error && <div className="error-banner">{error}</div>}

            <div className="interview-list">
                {interviews.length === 0 ? (
                    <p>No interviews scheduled yet.</p>
                ) : (
                    interviews.map((interview, index) => (
                        <div key={interview.id || index} className="interview-card">
                            <h3>{interview.interviewRound.company.companyName}</h3>
                            <p>Room: {interview.room.roomName}</p>
                            <p>Time: {interview.startTime}</p>
                        </div>
                    ))
                )}
            </div>

            <button onClick={logout}>Log Out</button>
        </div>
    )
}

