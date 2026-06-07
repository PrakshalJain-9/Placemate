import  useAuth  from "../../contexts/AuthContext";
import { useState } from "react";
import StudentManagement from "./StudentManagement";

export default function SuperAdminDashboard() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("home");

    return (
        <div>
            <nav>
                <div>
                    <div>
                        <div>
                            <h1>Institution Dashboard</h1>

                            <div className="hidden md:flex space-x-4">
                                <button
                                    onClick={() => setActiveTab('students')}
                                >
                                    Students
                                </button>
                                <button
                                    onClick={() => setActiveTab('interviews')}
                                >
                                    Interviews
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                >
                                    Settings
                                </button>
                            </div>
                        </div>

                        <div>
                            <span>Logged in as {user?.email}</span>
                            <button onClick={logout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                {activeTab === "home" && <h1>Welcome admin of {user?.collegeName}</h1>}
                {activeTab === 'students' && <StudentManagement />}
                {activeTab === 'interviews' && <div>Interview Management Coming Soon...</div>}
                {activeTab === 'settings' && <div>Settings Coming Soon...</div>}
            </main>
        </div>
    );
}