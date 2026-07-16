import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function Dashboard() {

    const [totalBooks, setTotalBooks]           = useState(0);
    const [totalMembers, setTotalMembers]       = useState(0);
    const [totalBorrows, setTotalBorrows]       = useState(0);
    const [totalCategories, setTotalCategories] = useState(0);
    const [recentBorrows, setRecentBorrows]     = useState([]);
    const [members, setMembers]                 = useState([]);
    const [books, setBooks]                     = useState([]);

    // THEME TOGGLE
    const [isDark, setIsDark] = useState(true);

    // SELECTED BORROW (for details modal)
    const [selectedBorrow, setSelectedBorrow] = useState(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const load = async () => {
            try {
                const [booksRes, membersRes, borrowsRes, catsRes] = await Promise.all([
                    api.get(`/books`),
                    api.get(`/members`),
                    api.get(`/BorrowTransactions`),
                    api.get(`/categories`),
                ]);

                const extract = (res) =>
                    Array.isArray(res.data) ? res.data : res.data?.data ?? [];

                const booksList = extract(booksRes);
                const membersList = extract(membersRes);
                const borrowsList = extract(borrowsRes);
                const catsList = extract(catsRes);

                setTotalBooks(booksList.length);
                setBooks(booksList);

                setTotalMembers(membersList.length);
                setMembers(membersList);

                setTotalBorrows(borrowsList.length);
                setRecentBorrows(borrowsList.slice(-5).reverse());

                setTotalCategories(catsList.length);

            } catch (e) { console.log(e); }
        };
        load();
    }, []);

    const getMemberName = (borrow) => {
        const id = borrow?.member?.memberId ?? borrow?.memberId;
        return borrow?.member?.fullName || members.find(x => x.memberId == id)?.fullName || "-";
    };
    const getBookTitle = (borrow) => {
        const id = borrow?.book?.bookId ?? borrow?.bookId;
        return borrow?.book?.title || books.find(x => x.bookId == id)?.title || "-";
    };

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

    // THEME-DEPENDENT CLASSES
    const t = {
        pageBg:      isDark ? "bg-gray-950" : "bg-gray-100",
        panelBg:     isDark ? "bg-gray-900" : "bg-white",
        panelBorder: isDark ? "border-gray-800" : "border-gray-200",
        heading:     isDark ? "text-white" : "text-gray-900",
        subtext:     isDark ? "text-gray-500" : "text-gray-500",
        tableHead:   isDark ? "text-gray-600" : "text-gray-400",
        tableBorder: isDark ? "border-gray-800" : "border-gray-200",
        rowHover:    isDark ? "hover:bg-gray-800/30" : "hover:bg-gray-50",
        rowBorder:   isDark ? "border-gray-800/60" : "border-gray-100",
        cellMuted:   isDark ? "text-gray-400" : "text-gray-500",
        cellFaint:   isDark ? "text-gray-500" : "text-gray-400",
        trackBg:     isDark ? "bg-gray-800" : "bg-gray-200",
        labelMuted:  isDark ? "text-gray-400" : "text-gray-500",
        emptyText:   isDark ? "text-gray-600" : "text-gray-400",
    };

    return (
        <div className={`flex min-h-screen ${t.pageBg} transition-colors duration-300`}>
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
                            <h1 className={`text-4xl font-black ${t.heading}`}>
                                Good day, {user.fullName?.split(" ")[0] || "Admin"} 👋
                            </h1>
                            <p className={`text-sm mt-1 ${t.subtext}`}>{today}</p>
                        </div>

                        <div className="flex items-center gap-3">

                            {/* THEME TOGGLE BUTTON */}
                            <button
                                onClick={() => setIsDark(prev => !prev)}
                                className={`relative w-16 h-9 rounded-full border transition-colors duration-300 flex items-center px-1
                                    ${isDark ? "bg-indigo-950 border-indigo-800" : "bg-amber-100 border-amber-300"}`}
                                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                            >
                                <span
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md transform transition-transform duration-300
                                        ${isDark ? "translate-x-7 bg-gray-900" : "translate-x-0 bg-white"}`}
                                >
                                    {isDark ? "🌙" : "☀️"}
                                </span>
                            </button>

                            {/* User Info */}
                            <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl ${t.panelBg} border ${t.panelBorder} transition-colors duration-300`}>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg bg-indigo-600">
                                    {user.fullName?.charAt(0).toUpperCase() || "A"}
                                </div>
                                <div>
                                    <p className={`text-sm font-semibold ${t.heading}`}>{user.fullName}</p>
                                    <p className="text-xs text-indigo-400">{user.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STAT CARDS */}
                    <div className="grid grid-cols-4 gap-5 mb-8">
                        {stats.map((stat) => (
                            <div key={stat.label}
                                className={`${stat.card} ${stat.shadow} rounded-2xl p-6 relative overflow-hidden shadow-xl`}>
                                <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/10 blur-2xl transform translate-x-8 -translate-y-8" />

                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                                        {stat.icon}
                                    </div>
                                    <span className={`${stat.badge} text-xs font-bold px-3 py-1 rounded-full`}>
                                        Live
                                    </span>
                                </div>

                                <p className="text-5xl font-black text-white mb-1">{stat.value}</p>
                                <p className="text-sm font-medium text-white/70">{stat.label}</p>

                                <div className="mt-4 h-1.5 rounded-full bg-white/20">
                                    <div className={`${stat.bar} h-1.5 rounded-full w-3/5 opacity-80`} />
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* BOTTOM */}
                    <div className="grid grid-cols-3 gap-6">

                        {/* RECENT BORROWS */}
                        <div className={`col-span-2 rounded-2xl p-6 ${t.panelBg} border ${t.panelBorder} transition-colors duration-300`}>

                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className={`text-lg font-bold ${t.heading}`}>Recent Borrows</h2>
                                    <p className={`text-xs mt-0.5 ${t.subtext}`}>Last 5 transactions</p>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${isDark ? "bg-indigo-950 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}>
                                    📋 Activity
                                </span>
                            </div>

                            <table className="w-full text-sm">
                                <thead>
                                    <tr className={`border-b ${t.tableBorder}`}>
                                        {["Member", "Book", "Date", "Status"].map(h => (
                                            <th key={h} className={`text-left pb-3 text-xs font-semibold uppercase tracking-wider ${t.tableHead}`}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBorrows.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className={`text-center py-10 text-sm ${t.emptyText}`}>
                                                No borrow records yet
                                            </td>
                                        </tr>
                                    ) : (
                                        recentBorrows.map((b) => (
                                            <tr
                                                key={b.borrowId}
                                                onClick={() => setSelectedBorrow(b)}
                                                className={`border-b ${t.rowBorder} ${t.rowHover} transition cursor-pointer`}
                                                title="Click to view details"
                                            >
                                                <td className={`py-3 font-semibold ${t.heading}`}>
                                                    {getMemberName(b)}
                                                </td>
                                                <td className={`py-3 ${t.cellMuted}`}>
                                                    {getBookTitle(b)}
                                                </td>
                                                <td className={`py-3 ${t.cellFaint}`}>
                                                    {b.borrowDate?.substring(0, 10)}
                                                </td>
                                                <td className="py-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold
                                                        ${b.status === "Returned"
                                                            ? (isDark ? "bg-emerald-950 text-emerald-400" : "bg-emerald-100 text-emerald-600")
                                                            : (isDark ? "bg-amber-950 text-amber-400" : "bg-amber-100 text-amber-600")
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
                        <div className={`rounded-2xl p-6 ${t.panelBg} border ${t.panelBorder} flex flex-col gap-5 transition-colors duration-300`}>

                            <div>
                                <h2 className={`text-lg font-bold ${t.heading}`}>Library Health</h2>
                                <p className={`text-xs mt-0.5 ${t.subtext}`}>Live overview</p>
                            </div>

                            {[
                                { label: "Books",      value: totalBooks,      color: "bg-indigo-500",  text: "text-indigo-400" },
                                { label: "Members",    value: totalMembers,    color: "bg-emerald-500", text: "text-emerald-400" },
                                { label: "Borrowed",   value: totalBorrows,    color: "bg-amber-500",   text: "text-amber-400" },
                                { label: "Categories", value: totalCategories, color: "bg-purple-500",  text: "text-purple-400" },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between mb-2">
                                        <span className={`text-sm font-medium ${t.labelMuted}`}>{item.label}</span>
                                        <span className={`text-sm font-bold ${item.text}`}>{item.value}</span>
                                    </div>
                                    <div className={`h-2 rounded-full ${t.trackBg}`}>
                                        <div className={`${item.color} h-2 rounded-full transition-all duration-700`}
                                            style={{ width: `${Math.min((item.value / (totalBooks || 1)) * 100, 100)}%` }} />
                                    </div>
                                </div>
                            ))}

                            <div className={`border-t ${t.panelBorder} pt-4 mt-auto`}>
                                <p className={`text-xs mb-3 uppercase tracking-wider ${isDark ? "text-gray-600" : "text-gray-400"}`}>System Status</p>
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

            {/* BORROW DETAILS MODAL */}
            {selectedBorrow && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedBorrow(null)}
                >
                    <div
                        className={`w-full max-w-md rounded-2xl p-6 ${t.panelBg} border ${t.panelBorder} shadow-2xl`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <p className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-1">
                                    Borrow Details
                                </p>
                                <h2 className={`text-xl font-bold ${t.heading}`}>
                                    #{selectedBorrow.borrowId}
                                </h2>
                            </div>
                            <button
                                onClick={() => setSelectedBorrow(null)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-lg
                                    ${isDark ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">

                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${t.labelMuted}`}>Member</span>
                                <span className={`text-sm font-semibold ${t.heading}`}>
                                    {getMemberName(selectedBorrow)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${t.labelMuted}`}>Book</span>
                                <span className={`text-sm font-semibold ${t.heading}`}>
                                    {getBookTitle(selectedBorrow)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${t.labelMuted}`}>Borrow Date</span>
                                <span className={`text-sm ${t.cellMuted}`}>
                                    {selectedBorrow.borrowDate?.substring(0, 10) || "-"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${t.labelMuted}`}>Due Date</span>
                                <span className={`text-sm ${t.cellMuted}`}>
                                    {selectedBorrow.dueDate?.substring(0, 10) || "-"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${t.labelMuted}`}>Return Date</span>
                                <span className={`text-sm ${t.cellMuted}`}>
                                    {selectedBorrow.returnDate?.substring(0, 10) || "-"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-700/30">
                                <span className={`text-sm ${t.labelMuted}`}>Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold
                                    ${selectedBorrow.status === "Returned"
                                        ? (isDark ? "bg-emerald-950 text-emerald-400" : "bg-emerald-100 text-emerald-600")
                                        : (isDark ? "bg-amber-950 text-amber-400" : "bg-amber-100 text-amber-600")
                                    }`}>
                                    {selectedBorrow.status}
                                </span>
                            </div>

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}