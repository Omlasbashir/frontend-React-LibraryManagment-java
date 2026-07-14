import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../services/api";

export default function Members() {

    const [search, setSearch] = useState("");

    const [memberId, setMemberId] = useState(0);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const [registerStatus, setRegisterStatus] = useState("Register");
    const [members, setMembers] = useState([]);

    const ClearData = () => {
        setMemberId(0);
        setFullName("");
        setEmail("");
        setPhone("");
        setAddress("");
        load_Members();
        setRegisterStatus("Register");
    };

   // Load Members
    const load_Members = async () => {
        try {
            const response = await api.get("/members");

            const data = response.data.data || response.data;
            setMembers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.log(error);
        }
    };

    // Get Member By Id
    const fill_MemberData = async (e, memberId) => {
        e.preventDefault();

        try {
            const response = await api.get(`/members/${memberId}`);

            const member = response.data.data || response.data;

            setMemberId(member.memberId);
            setFullName(member.fullName);
            setEmail(member.email);
            setPhone(member.phone);
            setAddress(member.address);

            setRegisterStatus("Update");
        } catch (error) {
            console.log(error);
        }
    };

    // Register / Update
    const register_New_Member = async (e) => {
        e.preventDefault();

        const postData = {
            fullName,
            email,
            phone,
            address
        };

        try {
            if (registerStatus === "Register") {
                await api.post("/members", postData);
            } else {
                await api.put(`/members/${memberId}`, postData);
            }

            ClearData();
            load_Members();
        } catch (error) {
            console.log(error);
        }
    };

    // Delete
    const remove_Member = async (e, fullName, memberId) => {
        e.preventDefault();

        if (!confirm(`Delete ${fullName}?`)) return;

        try {
            await api.delete(`/members/${memberId}`);
            load_Members();
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        load_Members();
    }, []);

    const filteredMembers = members.filter((member) =>
        member.fullName?.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar />
            <div className="ml-64 w-full">
                <Navbar />
                <div className="p-8">
                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800"> 👥 Members </h1>
                            <p className="text-gray-500 text-sm"> Manage library members</p>
                        </div>
                    </div>
                    {/* SEARCH + STATS */}
                    <div className="flex justify-between mb-4">
                        <input type="text" className="border px-3 py-2 rounded w-1/3" placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <div className="bg-white px-4 py-2 rounded shadow text-sm">Total Members: <b>{filteredMembers.length}</b>
                        </div>
                    </div>
                    {/* ADD / UPDATE MEMBER FORM */}
                    <form onSubmit={register_New_Member} className="bg-white shadow-lg rounded-xl p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-5">
                            {registerStatus === "Register" ? "Add New Member" : "Update Member"}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700"> Full Name </label>
                                <input type="text" placeholder="Enter full name..." onChange={(e) => setFullName(e.target.value)} value={fullName} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700"> Email </label>
                                <input type="email" placeholder="Enter email..." onChange={(e) => setEmail(e.target.value)} value={email} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"/>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">  Phone </label>
                                <input type="number" placeholder="Enter phone number..." onChange={(e) => setPhone(e.target.value)} value={phone} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"/>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700"> Address</label>
                                <input type="text" placeholder="Enter address..." onChange={(e) => setAddress(e.target.value)} value={address} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"/>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-lg">
                                {registerStatus === "Register" ? "Add Member" : "Update Member"}
                            </button>
                            <button type="button" onClick={ClearData} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"> Clear</button>
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
                                    <th className="p-3 text-left">Phone</th>
                                    <th className="p-3 text-left">Address</th>
                                    <th className="p-3 text-left">Registration Date</th>
                                    <th className="p-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map((member) => (
                                    <tr key={member.memberId} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{member.memberId}</td>
                                        <td className="p-3 font-semibold text-gray-800">{member.fullName} </td>
                                        <td className="p-3 text-gray-600">{member.email}  </td>
                                        <td className="p-3 text-gray-600"> {member.phone} </td>
                                        <td className="p-3 text-gray-600"> {member.address}  </td>
                                        {/* ✅ registrationDate — automatic backend ka yimaada */}
                                        <td className="p-3 text-gray-500">{member.registrationDate?.substring(0, 10)}</td>
                                        <td className="p-3 flex justify-center gap-2">
                                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded" onClick={(e) => fill_MemberData(e, member.memberId)}> Edit</button>
                                            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded" onClick={(e) => remove_Member(e, member.fullName, member.memberId)}>Delete </button>
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