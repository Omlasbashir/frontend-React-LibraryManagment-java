import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {

    const location = useLocation();
    const navigate = useNavigate();

    // localStorage ka user data keen
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user.role; // "Admin" or "Staff"

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    // ✅ Admin — wax kasta arko
    const adminMenus = [
        { path: "/dashboard",  icon: "🏠", label: "Dashboard"  },
        { path: "/categories", icon: "☰",  label: "Categories" },
        { path: "/books",      icon: "📖", label: "Books"      },
        { path: "/members",    icon: "👥", label: "Members"    },
        { path: "/borrows",    icon: "🔄", label: "Borrow"     },
        { path: "/users",      icon: "🔐", label: "Users"      },
    ];

    // ✅ Staff — Dashboard, Books, Borrow kaliya
    const staffMenus = [
        { path: "/dashboard",  icon: "🏠", label: "Dashboard"  },
        { path: "/categories", icon: "☰",  label: "Categories" },
        { path: "/books",      icon: "📖", label: "Books"      },
        { path: "/members",    icon: "👥", label: "Members"    },
        { path: "/borrows",    icon: "🔄", label: "Borrow"     },
    ];

    // Role ku xidsan menu doorso
    const menus = role === "Admin" ? adminMenus : staffMenus;

    return (
        <div className="w-64 bg-gray-900 min-h-screen fixed flex flex-col">

            {/* LOGO */}
            <div className="p-6 border-b border-gray-700">
                <h1 className="text-white text-2xl font-bold text-center">
                    📚 Library System
                </h1>
            </div>

            {/* USER INFO */}
            <div className="px-4 py-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                        {user.fullName?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                        <p className="text-white text-sm font-semibold">
                            {user.fullName || "User"}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded font-medium
                            ${role === "Admin"
                                ? "bg-red-500 text-white"
                                : "bg-green-500 text-white"
                            }`}>
                            {role || "Staff"}
                        </span>
                    </div>
                </div>
            </div>

            {/* MENU */}
            <nav className="flex-1 px-4 py-4">
                {menus.map((menu) => (
                    <Link
                        key={menu.path}
                        to={menu.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition text-sm font-medium
                            ${location.pathname === menu.path
                                ? "bg-blue-600 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            }`}
                    >
                        <span>{menu.icon}</span>
                        <span>{menu.label}</span>
                    </Link>
                ))}
            </nav>

            {/* LOGOUT */}
            <div className="p-4  border-t border-gray-700">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4  py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition text-sm font-medium"
                >
                    
                    <span>🚪</span>
                    <span >Logout</span>
                </button>
            </div>

        </div>
    );
}