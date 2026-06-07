import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../contexts/AuthContext";
import { api } from "../../api/axios";

export default function UserLogin() {

    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await api.post("/api/auth/student/login", {
                emailId: email,
                password: password
            });

            console.log(response.data);
            login(response.data);
            navigate("/student/dashboard/home");
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Invalid email or password.");
        }
    }

    return (
        <div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="email">Email: </label>
                <input name="email" onChange={(e) => { setEmail(e.target.value) }} value={email} required />
                <br />
                <label htmlFor="password">Password: </label>
                <input name="password" onChange={(e) => { setPassword(e.target.value) }} value={password} required />

                <button type="submit">Log In</button>
            </form>
        </div>
    )
}   