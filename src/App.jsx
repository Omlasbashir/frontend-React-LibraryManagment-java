import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Categories from "./pages/Categories";
import Books from "./pages/Books";
import Members from "./pages/Members";
import BorrowTransactions from "./pages/BorrowTransactions";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Routes>

            <Route path="/" element={<Login />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route path="/users" element={<Users />} />

            <Route path="/categories" element={<Categories />} />

            <Route path="/books" element={<Books />} />

            <Route path="/members" element={<Members />} />

            <Route path="/Borrows" element={<BorrowTransactions />} />

        </Routes>
    );
}

export default App;