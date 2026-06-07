import { useState } from "react";
import { api } from "../../api/axios";
import { useNavigate } from "react-router-dom";


export default function UserSignUp() {

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const handleSubmitStep1 = async (e) => {

        console.log(email);
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post("/api/auth/student/sendotp", {
                "email": email
            })

            console.log(response.data);
            setStep(2);
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    const handleSubmitStep2 = async (e) => {

        setLoading(true);
        e.preventDefault();
        try {
            const response = await api.post("/api/auth/student/validateotp", {
                "email": email,
                "otp": otp
            });

            setToken(response.data);
            setStep(3);
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }


    const handleSubmitStep3 = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (password !== confirmPassword) { window.alert("The password and confirm password field is not same"); return; }

        try {
            const response = await api.post("/api/auth/student/setpassword", {
                "token": token,
                "password": password
            })

            navigate("/student/dashboard/home");

        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    if (step === 1) {
        return (
            <div>
                <form onSubmit={(e) => handleSubmitStep1(e)}>
                    <label htmlFor="email">Email: </label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <button type="submit" disabled={loading}>
                        {loading ? "Please wait..." : "Set Password"}
                    </button>
                </form>
            </div>
        )
    }


    if (step === 2) {
        return (
            <div>
                <form onSubmit={(e) => handleSubmitStep2(e)}>
                    <label htmlFor="otp">Please enter the Otp: </label>
                    <input value={otp} onChange={(e) => setOtp(e.target.value)} />
                    <button type="submit" disabled={loading}>
                        {loading ? "Please wait..." : "Set Password"}
                    </button>
                </form>
            </div>
        );
    }


    if (step === 3) {
        return (
            <div>
                <form onSubmit={(e) => handleSubmitStep3(e)}>
                    <label htmlFor="password">Password: </label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <label htmlFor="confirm password">Confirm Password: </label>
                    <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                    <button type="submit" disabled={loading}>
                        {loading ? "Please wait..." : "Set Password"}
                    </button>
                </form>
            </div>
        )
    }
}