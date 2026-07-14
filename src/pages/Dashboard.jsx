import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../services/api";
export default function Dashboard() {

    const [totalBooks, setTotalBooks]           = useState(0);
    const [totalMembers, setTotalMembers]       = useState(0);
    const [totalBorrows, setTotalBorrows]       = useState(0);
    const [totalCategories, setTotalCategories] = useState(0);
    const [recentBorrows, setRecentBorrows]     = useState([]);
    const [members, setMembers]                 = useState([]);
    const [books, setBooks]                     = useState([]);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    console.log("USER DATA:", user);

    useEffect(() => {
        const load = async () => {
            try {
                const [booksRes, membersRes, borrowsRes, catsRes] = await Promise.all([
                    api.get(`/books`),
                    api.get(`/members`),
                    api.get(`/borrowTransactions`),
                    api.get(`/categories`),
                ]);
                if (booksRes.data.status)   { setTotalBooks(booksRes.data.data.length); setBooks(booksRes.data.data); }
                if (membersRes.data.status) { setTotalMembers(membersRes.data.data.length); setMembers(membersRes.data.data); }
                if (borrowsRes.data.status) { setTotalBorrows(borrowsRes.data.data.length); setRecentBorrows(borrowsRes.data.data.slice(-5).reverse()); }
                if (catsRes.data.status)    setTotalCategories(catsRes.data.data.length);
            } catch (e) { console.log(e); }
        };
        load();
    }, []);

    const getMemberName = (id) => members.find(x => x.memberId == id)?.memberId || "-";
    const getBookTitle  = (id) => books.find(x => x.bookId == id)?.bookId || "-";

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    const stats = [
        {
            label: "Total Books",
            value: totalBooks,
            icon: "📚",
            card:  "bg-gradient-to-br from-blue-500 to-blue-700",
            shadow: "shadow-blue-500/30",
            badge: "bg-blue-400/20 text-blue-100",
            bar:   "bg-blue-300",
        },
        {
            label: "Members",
            value: totalMembers,
            icon: "👥",
            card:  "bg-gradient-to-br from-emerald-500 to-emerald-700",
            shadow: "shadow-emerald-500/30",
            badge: "bg-emerald-400/20 text-emerald-100",
            bar:   "bg-emerald-300",
        },
        {
            label: "Borrowed",
            value: totalBorrows,
            icon: "📖",
            card:  "bg-gradient-to-br from-amber-400 to-orange-600",
            shadow: "shadow-orange-500/30",
            badge: "bg-orange-400/20 text-orange-100",
            bar:   "bg-orange-300",
        },
        {
            label: "Categories",
            value: totalCategories,
            icon: "🏷️",
            card:  "bg-gradient-to-br from-purple-500 to-purple-700",
            shadow: "shadow-purple-500/30",
            badge: "bg-purple-400/20 text-purple-100",
            bar:   "bg-purple-300",
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-950">

            <Sidebar />

            <div className="ml-64 w-full">

                <Navbar />

                <div className="p-8">

                    {/* WELCOME */}
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <p className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-1">
                                Library Management System
                            </p>
                            <h1 className="text-4xl font-black text-white">
                                Good day, {user.fullName?.split(" ")[0] || "Admin"} 👋
                            </h1>
                            <p className="text-sm mt-1 text-gray-500">{today}</p>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gray-900 border border-gray-800">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg  bg-indigo-600">
                                {user.fullName?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <div>
                                <p className="text-white text-sm font-semibold">{user.fullName}</p>
                                <p className="text-xs text-indigo-400">{user.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* STAT CARDS */}
                    <div className="grid grid-cols-4 gap-5 mb-8">
                        {stats.map((stat) => (
                            <div key={stat.label}
                                className={`${stat.card} ${stat.shadow} rounded-2xl p-6 relative overflow-hidden shadow-xl`}>
                                {/* Glow */}
                                <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/10 blur-2xl transform translate-x-8 -translate-y-8" />

                                {/* Top row */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                                        {stat.icon}
                                    </div>
                                    <span className={`${stat.badge} text-xs font-bold px-3 py-1 rounded-full`}>
                                        Live
                                    </span>
                                </div>

                                {/* Value */}
                                <p className="text-5xl font-black text-white mb-1">{stat.value}</p>
                                <p className="text-sm font-medium text-white/70">{stat.label}</p>

                                {/* Bar */}
                                <div className="mt-4 h-1.5 rounded-full bg-white/20">
                                    <div className={`${stat.bar} h-1.5 rounded-full w-3/5 opacity-80`} />
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* BOTTOM */}
                    <div className="grid grid-cols-3 gap-6">

                        {/* RECENT BORROWS */}
                        <div className="col-span-2 rounded-2xl p-6 bg-gray-900 border border-gray-800">

                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white">Recent Borrows</h2>
                                    <p className="text-xs mt-0.5 text-gray-500">Last 5 transactions</p>
                                </div>
                                <span className="text-xs px-3 py-1 rounded-full font-semibold bg-indigo-950 text-indigo-400">
                                    📋 Activity
                                </span>
                            </div>

                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        {["Member", "Book", "Date", "Status"].map(h => (
                                            <th key={h} className="text-left pb-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBorrows.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-10 text-sm text-gray-600">
                                                No borrow records yet
                                            </td>
                                        </tr>
                                    ) : (
                                        recentBorrows.map((b) => (
                                            <tr key={b.borrowId} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition">
                                                <td className="py-3 font-semibold text-white">
                                                    {getMemberName(b.memberId)}
                                                </td>
                                                <td className="py-3 text-gray-400">
                                                    {getBookTitle(b.bookId)}
                                                </td>
                                                <td className="py-3 text-gray-500">
                                                    {b.borrowDate?.substring(0, 10)}
                                                </td>
                                                <td className="py-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold
                                                        ${b.status === "Returned"
                                                            ? "bg-emerald-950 text-emerald-400"
                                                            : "bg-amber-950 text-amber-400"
                                                        }`}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* LIBRARY HEALTH */}
                        <div className="rounded-2xl p-6 bg-gray-900 border border-gray-800 flex flex-col gap-5">

                            <div>
                                <h2 className="text-lg font-bold text-white">Library Health</h2>
                                <p className="text-xs mt-0.5 text-gray-500">Live overview</p>
                            </div>

                            {[
                                { label: "Books",      value: totalBooks,      color: "bg-indigo-500",  text: "text-indigo-400" },
                                { label: "Members",    value: totalMembers,    color: "bg-emerald-500", text: "text-emerald-400" },
                                { label: "Borrowed",   value: totalBorrows,    color: "bg-amber-500",   text: "text-amber-400" },
                                { label: "Categories", value: totalCategories, color: "bg-purple-500",  text: "text-purple-400" },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-400">{item.label}</span>
                                        <span className={`text-sm font-bold ${item.text}`}>{item.value}</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-800">
                                        <div className={`${item.color} h-2 rounded-full transition-all duration-700`}
                                            style={{ width: `${Math.min((item.value / (totalBooks || 1)) * 100, 100)}%` }} />
                                    </div>
                                </div>
                            ))}

                            <div className="border-t border-gray-800 pt-4 mt-auto">
                                <p className="text-xs text-gray-600 mb-3 uppercase tracking-wider">System Status</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-sm font-medium text-emerald-400">
                                        All systems operational
                                    </span>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}