import { useNavigate } from "react-router-dom";

export default function Navbar() {

    const navigate = useNavigate();

    function Logout(){

        localStorage.removeItem("user");

        navigate("/");

    }

    return (

        <div className="bg-white shadow h-16 flex justify-end items-center px-8">
            <h1 className="text-2xl  font-bold mr-auto">Library Management</h1>
            <button
                onClick={Logout}
                className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 "
            >
                Logout
            </button>

        </div>

    );

}