import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import  useAuth from "../../contexts/AuthContext";
import { api } from "../../api/axios";
import { loginSuperAdmin, loginWithGoogle } from "../../api/auth";



export default function SuperAdminLogin() {

    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();


    function handleLogin(e) {
        setLoading(true);
        e.preventDefault();

        try {
            const requestData = {
                "emailId": email,
                "password": password
            }

            const data = loginSuperAdmin(requestData);
            console.log(data);
            login(data);
        }
        catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }

        navigate("/superadmin/dashboard/home");
    }




    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500">
                        Log in to access your Institution Dashboard
                    </p>
                </div>

                {errorMsg && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Admin Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="admin@college.edu"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors mt-2"
                    >
                        {loading ? "Authenticating..." : "Log In"}
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-center">
                    <div className="border-t border-gray-300 w-full"></div>
                    <span className="bg-white px-4 text-sm text-gray-500">or</span>
                    <div className="border-t border-gray-300 w-full"></div>
                </div>

                {/* <div className="mt-6">
                    <button
                        onClick={handleGoogleOAuthLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" width={12} />
                        Sign in with Google
                    </button>
                </div> */}

                <div className="mt-8 text-center text-sm text-gray-500">
                    Don't have an institution account?{' '}
                    <Link to="/superadmin/register" className="text-blue-600 hover:underline font-semibold">
                        Register here
                    </Link>
                </div>

            </div>
        </div>
    );
}