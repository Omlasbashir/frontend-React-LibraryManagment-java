import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const LoginUser = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.get(`https://localhost:7019/api/User`);
            const result = response.data;

            if (result.status) {

                // ✅ Model fields: Email, PasswordHash, FullName, Role
                const foundUser = result.data.find(
                    (u) =>
                        u.email?.toLowerCase() === email.trim().toLowerCase() &&
                        u.passwordHash === password
                );

                if (foundUser) {

                    Swal.fire({
                        icon: "success",
                        title: "Login Success",
                        text: `Welcome back, ${foundUser.fullName}!`,
                        timer: 1500,
                        showConfirmButton: false,
                    });

                    localStorage.setItem("user", JSON.stringify({
                        userId:   foundUser.userId,
                        fullName: foundUser.fullName,
                        email:    foundUser.email,
                        role:     foundUser.role,
                    }));

                    setTimeout(() => {
                        navigate("/dashboard");
                    }, 1500);

                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Login Failed",
                        text: "Invalid email or password",
                    });
                }

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: result.message,
                });
            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Connection Error",
                text: "Could not connect to server. Please try again.",
            });
            console.log(`Exception: ${error}`);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-100 flex justify-center items-center">

            <form onSubmit={LoginUser}
                className="bg-white p-8 rounded-xl shadow-xl w-96">

                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">📚</div>
                    <h1 className="text-3xl font-bold text-gray-800">Library System</h1>
                    <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter your email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter your password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white w-full p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold transition"
                >
                    {loading ? "Signing in..." : "Login"}
                </button>

            </form>

        </div>
    );
}