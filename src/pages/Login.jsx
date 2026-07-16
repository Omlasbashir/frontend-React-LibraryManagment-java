import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { login , register } from "../services/api";

export default function Login() {
const navigate = useNavigate();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);

const [page, setPage] = useState("login");

const [forgotEmail, setForgotEmail] = useState("");

const [regFullName, setRegFullName] = useState("");
const [regEmail, setRegEmail] = useState("");
const [regPassword, setRegPassword] = useState("");
const [regConfirm, setRegConfirm] = useState("");
const [regLoading, setRegLoading] = useState(false);

// ================= LOGIN =================
const LoginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await login({
            email: email.trim(),
            password: password,
        });
        const data = response.data;

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("user", JSON.stringify(data));

        await Swal.fire({
            icon: "success",
            title: "Login Success",
            text: `Welcome ${data.fullName}`,
            timer: 1500,
            showConfirmButton: false,
        });
        navigate("/dashboard");
    } catch (error) {
        console.error(
            "LOGIN ERROR:",
            error.response?.data || error.message
        );

        Swal.fire({
            icon: "error",
            title: "Login Failed",
            text:
                error.response?.data?.message ||
                "Invalid email or password",
        });

    } finally {
        setLoading(false);
    }
};

// ================= FORGOT PASSWORD =================
const handleForgot = async (e) => {
    e.preventDefault();
    Swal.fire({
        icon: "info",
        title: "Forgot Password",
        text: "Please contact your administrator to reset your password.",
    });
    setForgotEmail("");
};

// ================= REGISTER =================
const handleRegister = async (e) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Passwords do not match!",
        });
        return;
    }
    setRegLoading(true);
    try {
        const response = await register({
            fullName: regFullName,
            email: regEmail,
            password: regPassword,
            role: "Staff",
        });
        const data = response.data;
        Swal.fire({
            icon: "success",
            title: "Account Created!",
            text: "You can now login with your new account.",
            confirmButtonColor: "#3b82f6",
        });
        setRegFullName("");
        setRegEmail("");
        setRegPassword("");
        setRegConfirm("");
        setPage("login");
    } catch (error) {
        console.error(
            "REGISTER ERROR:",
            error.response?.data || error.message
        );

        Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text:
                error.response?.data?.message ||
                "Could not create account.",
        });

    } finally {
        setRegLoading(false);
    }
};
return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-112.5">
            {/* LOGO */}
            <div className="text-center mb-8">
                <div className="text-6xl mb-4">📚</div>
                <h1 className="text-3xl font-black text-gray-800">  Library System </h1>
                <p className="text-gray-400 text-sm mt-2">
                    {page === "login" &&
                        "Welcome back! Sign in to access your dashboard."}

                    {page === "forgot" &&
                        "Enter your email to recover your password."}

                    {page === "register" &&
                        "Create a new account to get started."}
                </p>
            </div>
            {/* ================= LOGIN ================= */}
            {page === "login" && (
                <form onSubmit={LoginUser}>
                    <div className="mb-5">
                        <label className="block text-sm font-bold text-gray-700 mb-2"> Email </label>
                        <input type="email" required placeholder="you@example.com"  value={email}  onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-200 w-full p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2"> Password </label>
                        <input type="password" required placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-200 w-full p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>
                    <div className="flex justify-end mb-6">
                        <button type="button"  onClick={() => setPage("forgot")} className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition" > Forgot password?  </button>
                    </div>
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white w-full p-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-bold text-lg transition shadow-lg shadow-blue-200"
                    > {loading ? "Signing in..." : "Sign In"}
                    </button>
                    <p className="text-center text-sm text-gray-400 mt-6">
                        Don't have an account?{" "}
                        <button  type="button" onClick={() => setPage("register")} className="text-blue-600 font-bold hover:text-blue-800 transition" >  Create one </button>
                    </p>
                </form>
            )}
            {/* ================= FORGOT PASSWORD ================= */}
            {page === "forgot" && (
                <form onSubmit={handleForgot}>
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">  Email  </label>
                        <input type="email"  required placeholder="Enter your email..." value={forgotEmail} onChange={(e) =>  setForgotEmail(e.target.value) }
                            className="border border-gray-200 w-full p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white w-full p-4 rounded-xl hover:bg-blue-700 font-bold text-lg transition shadow-lg shadow-blue-200" >
                        Recover Password
                    </button>
                    <p className="text-center text-sm text-gray-400 mt-6">
                        Remember your password?{" "}
                        <button type="button" onClick={() => setPage("login")} className="text-blue-600 font-bold hover:text-blue-800 transition" >Sign In </button>
                    </p>
                </form>
            )}

            {/* ================= REGISTER ================= */}
            {page === "register" && (
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2"> Full Name  </label>
                        <input type="text" required  placeholder="Enter your full name..." value={regFullName}  onChange={(e) => setRegFullName(e.target.value) }
                            className="border border-gray-200 w-full p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">   Email  </label>
                        <input type="email" required  placeholder="Enter your email..." value={regEmail} onChange={(e) =>setRegEmail(e.target.value) }
                            className="border border-gray-200 w-full p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">  Password  </label>
                        <input  type="password"  required placeholder="Enter password..." value={regPassword}  onChange={(e) => setRegPassword(e.target.value)} className="border border-gray-200 w-full p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2"> Confirm Password </label>
                        <input  type="password" required  placeholder="Confirm your password..." value={regConfirm}  onChange={(e) =>  setRegConfirm(e.target.value) }  className="border border-gray-200 w-full p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                    </div>
                    <button type="submit"  disabled={regLoading} className="bg-blue-600 text-white w-full p-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-bold text-lg transition shadow-lg shadow-blue-200">
                        {regLoading
                            ? "Creating..."
                            : "Create Account"}
                    </button>
                    <p className="text-center text-sm text-gray-400 mt-6">
                        Already have an account?{" "}
                        <button type="button"  onClick={() => setPage("login")} className="text-blue-600 font-bold hover:text-blue-800 transition" > Sign In </button>
                    </p>
                </form>
            )}
        </div>
    </div>
);

}
