import { useState } from "react";
import { requestEmailOtp, verifyOtpAndRegister } from "../../api/auth"
import { useNavigate, Link } from "react-router-dom";
export default function RegisterSuperAdmin() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [collegeName, setCollegeName] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [otp, setOtp] = useState("");

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");


    async function handleRequestOtp(e) {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        try {
            await requestEmailOtp(email);
            setStep(2);
        } catch (error) {
            setErrorMsg(error);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }


    async function handleOtpValidation(e) {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const registerRequest = {
                emailId: email,
                password: password,
                name: name,
                college: {
                    collegeName: collegeName,
                    address: {
                        street: street,
                        city: city,
                        state: state,
                        country: country,
                        zipCode: zipCode
                    }
                },
                otp: otp
            };

            console.log(registerRequest);
            const data = await verifyOtpAndRegister(registerRequest);
            navigate("/superadmin/login");
        } catch (error) {
            console.log(error);
            setErrorMsg(error)
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
                <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
                    Register Institution
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    {step === 1 ? "Step 1: Institution Details" : "Step 2: Email Verification"}
                </p>

                {errorMsg && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                        {errorMsg}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleRequestOtp} className="space-y-6">

                        <div>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Admin Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Full Name</label>
                                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Admin Email</label>
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Password</label>
                                    <input type="password" required minLength="8" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Institution Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">College Name</label>
                                    <input type="text" required value={collegeName} onChange={(e) => setCollegeName(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Street Address</label>
                                    <input type="text" required value={street} onChange={(e) => setStreet(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium mb-1">City</label>
                                        <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium mb-1">State</label>
                                        <input type="text" required value={state} onChange={(e) => setState(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium mb-1">Country</label>
                                        <input type="text" required value={country} onChange={(e) => setCountry(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium mb-1">Zip Code</label>
                                        <input type="text" required value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors mt-6">
                            {loading ? "Sending OTP..." : "Continue to Verification"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleOtpValidation} className="space-y-6">
                        <div className="text-center bg-blue-50 p-4 rounded-lg mb-6">
                            <p className="text-sm text-gray-700">
                                We sent a 6-digit verification code to<br />
                                <strong className="text-blue-600 text-lg">{email}</strong>
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-center">Enter 6-Digit OTP</label>
                            <input
                                type="text"
                                required
                                maxLength="6"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full border-2 border-gray-300 p-4 rounded-lg text-center text-3xl tracking-[0.5em] font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="------"
                            />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold p-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
                            {loading ? "Verifying & Registering..." : "Complete Registration"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-gray-500 text-sm hover:text-gray-700 underline mt-2"
                        >
                            Wait, I need to fix a typo in my details
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center text-sm text-gray-500 border-t pt-6">
                    Already have an institution account? <Link to="/superadmin/login" className="text-blue-600 hover:underline font-semibold">Log in here</Link>
                </div>
            </div>
        </div>
    );
}