import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Users() {

    const [search, setSearch] = useState("");
    const [userId, setUserId] = useState(0);
    const [FullName, setFullName]  = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole]= useState("Admin");
    const [registerStatus, setRegisterStatus] = useState("Register");
    const [users, setUsers] = useState([]);

    const load_Users = async () => {
        try {
            const { data } = await axios.get("https://localhost:7019/api/User");
            if (data.status) setUsers(data.data);
            else console.log(data.message);
        } catch (e) { console.log(e); }
    };

    useEffect(() => { load_Users(); }, []);

    const ClearData = () => {
        setUserId(0); setFullName(""); 
        setEmail("");
        setPassword(""); setRole("Admin");
        setRegisterStatus("Register"); 
        load_Users();
    };

    const register_New_User = async (e) => {
        e.preventDefault();

        try {

            let postData = {
                "FullName": FullName,
                "Email": email,
                "PasswordHash": password,
                "Role": role
            };

            let response;

            if (registerStatus == "Register") {
                response = await axios.post( "https://localhost:7019/api/User", postData);
            } else if (registerStatus == "Update") {
                postData.UserId = userId;
                response = await axios.put( "https://localhost:7019/api/User",  postData );
            }
            let result = response.data;
            if (result.status) {
                ClearData();
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {

            console.log(error);

        }
    };


    const fill_UserData = async (e, id) => {
        e.preventDefault();
        try {
            const { data } = await axios.get(`https://localhost:7019/api/User/${id}`);
            if (data.status) {
                setUserId(data.data.userId);
                setFullName(data.data.fullName);
                setEmail(data.data.email);
                setPassword("");
                setRole(data.data.role);
                setRegisterStatus("Update");
            }
        } catch (e) { console.log(e); }
    };

    //delete
    const remove_User = async (e, name, id) => {
        e.preventDefault();
        if (!confirm(`Delete user: ${name}?`)) return;
        try {
            const { data } = await axios.delete(`https://localhost:7019/api/User/${id}`);
            data.status ? load_Users() : alert(`Error: ${data.message}`);
        } catch (e) { console.log(e); }
    };

    // ✅ search → searchTerm khalad la saxay
    const filteredUsers = users.filter((u) => {
        if (!u.fullName) return false;
        return u.fullName.toLowerCase().includes(search.toLowerCase()) ||
               u.email?.toLowerCase().includes(search.toLowerCase());
    });

    const roleBadge = (r) => ({
        Admin:     "bg-red-100 text-red-700",
        Staff:     "bg-green-100 text-green-700",
        Librarian: "bg-blue-100 text-blue-700",
    }[r] || "bg-gray-100 text-gray-700");

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar />
            <div className="ml-64 w-full">
                <Navbar />
                <div className="p-8">

                    {/* HEADER */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">🔐 Users</h1>
                        <p className="text-gray-500 text-sm">Manage system users & roles</p>
                    </div>

                    {/* SEARCH + STATS */}
                    <div className="flex justify-between mb-4">
                        <input
                            type="text"
                            className="border px-3 py-2 rounded w-1/3"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="bg-white px-4 py-2 rounded shadow text-sm">
                            Total Users: <b>{filteredUsers.length}</b>
                        </div>
                    </div>

                    {/* FORM */}
                    <form onSubmit={register_New_User} className="bg-white shadow-lg rounded-xl p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-5">
                            {registerStatus === "Register" ? "Add New User" : "Update User"}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">Full Name</label>
                                <input type="text" placeholder="Enter full name..."
                                    value={FullName} onChange={(e) => setFullName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
                                <input type="email" placeholder="Enter email..."
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">
                                    Password
                                    {registerStatus === "Update" && (
                                        <span className="text-gray-400 font-normal ml-2 text-xs">(Leave blank to keep current)</span>
                                    )}
                                </label>
                                <input type="password" placeholder="Enter password..."
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">Role</label>
                                <select value={role} onChange={(e) => setRole(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="Admin">Admin</option>
                                    <option value="Staff">Staff</option>
                                    <option value="Librarian">Librarian</option>
                                </select>
                            </div>

                        </div>

                        <div className="flex gap-3">
                            <button type="submit" className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-lg">
                                {registerStatus === "Register" ? "Add User" : "Update User"}
                            </button>
                            <button type="button" onClick={ClearData} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg">
                                Clear
                            </button>
                        </div>
                    </form>

                    {/* TABLE */}
                    <div className="bg-white shadow rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-900 text-white">
                                <tr>
                                    <th className="p-3 text-left">ID</th>
                                    <th className="p-3 text-left">Full Name</th>
                                    <th className="p-3 text-left">Email</th>
                                    <th className="p-3 text-left">Role</th>
                                    <th className="p-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.userId} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{user.userId}</td>
                                        <td className="p-3 font-semibold text-gray-800">{user.fullName}</td>
                                        <td className="p-3 text-gray-600">{user.email}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-sm font-medium ${roleBadge(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-3 flex justify-center gap-2">
                                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                                onClick={(e) => fill_UserData(e, user.userId)}>Edit</button>
                                            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                                onClick={(e) => remove_User(e, user.fullName, user.userId)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}