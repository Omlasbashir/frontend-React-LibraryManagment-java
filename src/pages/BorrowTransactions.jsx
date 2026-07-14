import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../services/api";

export default function BorrowTransactions() {

    const [search, setSearch] = useState("");

    const [borrowId, setBorrowId] = useState(0);
    const [memberId, setMemberId] = useState("");
    const [bookId, setBookId] = useState("");
    const [borrowDate, setBorrowDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("Borrowed");

    const [members, setMembers] = useState([]);
    const [books, setBooks] = useState([]);

    const [registerStatus, setRegisterStatus] = useState("Register");
    const [borrows, setBorrows] = useState([]);
   

    const getMemberName = (borrow) => {
        return borrow.member?.fullName || "";
    };


    const getBookTitle = (borrow) => {
        return borrow.book?.title || "";
    };


    const ClearData = () => {
        setBorrowId(0);
        setMemberId("");
        setBookId("");
        setBorrowDate("");
        setReturnDate("");
        setDueDate("");
        setStatus("Borrowed");
        setRegisterStatus("Register");
        load_Borrows();
    };


    // REGISTER + UPDATE
    const register_New_Borrow = async (e) => {

        e.preventDefault();

        try {

            const postData = {
                member: {
                    memberId: Number(memberId)
                },
                book: {
                    bookId: Number(bookId)
                },
                borrowDate,
                dueDate,
                returnDate,
                status
            };


            if(registerStatus === "Register"){

                await api.post("/BorrowTransactions", postData);

            }else{

                await api.put(`/BorrowTransactions/${borrowId}`, postData);

            }


            alert("Success");
            ClearData();


        }catch(error){

            console.log(error);

        }
    };



    // GET ONE
    const fill_BorrowData = async (e,id)=>{

        e.preventDefault();

        try{

            const response = await api.get(`/BorrowTransactions/${id}`);

            const data = response.data.data; // muhiim

            setBorrowId(data.borrowId);
            setMemberId(data.member?.memberId || "");
            setBookId(data.book?.bookId || "");
            setBorrowDate(data.borrowDate?.substring(0,10));
            setDueDate(data.dueDate?.substring(0,10));
            setReturnDate(data.returnDate?.substring(0,10));
            setStatus(data.status);

            setRegisterStatus("Update");


        }catch(error){

            console.log(error);

        }

    };



    // GET ALL
    const load_Borrows = async () => {
        try {
            const response = await api.get("/BorrowTransactions");

            setBorrows(response.data || []);

        } catch(error){
            console.log(error);
            setBorrows([]);
        }
    };



    const load_Members = async () => {
        try {
            const response = await api.get("/members");

            setMembers(response.data || []);

        } catch(error){
            console.log(error);
            setMembers([]);
        }
    };



    const load_Books = async () => {
        try {
            const response = await api.get("/books");

            setBooks(response.data || []);

        } catch(error){
            console.log(error);
            setBooks([]);
        }
    };



    // DELETE
    const remove_Borrow = async(e,id)=>{

        e.preventDefault();

        if(confirm("Delete this borrow?")){

            try{

                await api.delete(`/BorrowTransactions/${id}`);

                alert("Deleted Successfully");

                load_Borrows();


            }catch(error){

                console.log(error);

            }

        }

    };

    useEffect(() => {
        load_Borrows();
        load_Members();
        load_Books();
    }, []);

    const filteredBorrows = borrows.filter((borrow) =>
        getMemberName(borrow)
            .toLowerCase()
            .includes(search.toLowerCase())
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
                            <h1 className="text-3xl font-bold text-gray-800"> 📖 Borrows </h1>
                            <p className="text-gray-500 text-sm"> Manage book borrowing records</p>
                        </div>
                    </div>

                    {/* SEARCH + STATS */}
                    <div className="flex justify-between mb-4">
                        <input type="text"className="border px-3 py-2 rounded w-1/3" placeholder="Search by member name..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <div className="bg-white px-4 py-2 rounded shadow text-sm">
                            Total Borrows: <b>{filteredBorrows.length}</b>
                        </div>
                    </div>

                    {/* ADD / UPDATE BORROW FORM */}
                    <form onSubmit={register_New_Borrow} className="bg-white shadow-lg rounded-xl p-6 mb-6">

                        <h2 className="text-xl font-bold text-gray-800 mb-5">
                            {registerStatus === "Register" ? "Add New Borrow" : "Update Borrow"}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">Member</label>
                                <select value={memberId} onChange={(e) => setMemberId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" >
                                    <option value="">Select member</option>
                                    {members.map((m) => (
                                        <option key={m.memberId} value={m.memberId}>
                                            {m.memberId} 
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">Book</label>
                                <select value={bookId} onChange={(e) => setBookId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none">    
                                   
                                    <option value="">Select book</option>
                                    {books.map((b) => (
                                        <option key={b.bookId} value={b.bookId}>
                                            {b.bookId} 
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="Borrowed">Borrowed</option>
                                    <option value="Returned">Returned</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">Borrow Date</label>
                                <input
                                    type="date"
                                    onChange={(e) => setBorrowDate(e.target.value)}
                                    value={borrowDate}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {/* ✅ DueDate input */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">Due Date</label>
                                <input
                                    type="date"
                                    onChange={(e) => setDueDate(e.target.value)}
                                    value={dueDate}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">Return Date</label>
                                <input
                                    type="date"
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    value={returnDate}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="flex gap-2 items-end">
                                <button type="submit" className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-lg w-full">
                                    {registerStatus === "Register" ? "Add Borrow" : "Update Borrow"}
                                </button>
                                <button type="button" onClick={ClearData} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg w-full">
                                    Clear
                                </button>
                            </div>

                        </div>

                    </form>

                    {/* TABLE */}
                    <div className="bg-white shadow rounded-xl overflow-hidden">

                        <table className="w-full">

                            <thead className="bg-gray-900 text-white">
                                <tr>
                                    <th className="p-3 text-left">ID</th>
                                    <th className="p-3 text-left">Member</th>
                                    <th className="p-3 text-left">Book</th>
                                    <th className="p-3 text-left">Borrow Date</th>
                                    <th className="p-3 text-left">Due Date</th>
                                    <th className="p-3 text-left">Return Date</th>
                                    <th className="p-3 text-left">Status</th>
                                    <th className="p-3 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredBorrows.map((borrow)=>(

                                <tr key={borrow.borrowId} className="border-b hover:bg-gray-50">

                                <td className="p-3">
                                    {borrow.borrowId}
                                </td>


                                <td className="p-3 font-semibold text-gray-800">
                                    {getMemberName(borrow)}
                                </td>


                                <td className="p-3 text-gray-600">
                                    {getBookTitle(borrow)}
                                </td>


                                <td className="p-3 text-gray-500">
                                    {borrow.borrowDate?.substring(0,10)}
                                </td>


                                <td className="p-3 text-gray-500">
                                    {borrow.dueDate?.substring(0,10)}
                                </td>


                                <td className="p-3 text-gray-500">
                                    {borrow.returnDate?.substring(0,10)}
                                </td>


                                <td className="p-3">
                                <span className={`px-2 py-1 rounded text-sm font-medium
                                ${borrow.status === "Returned"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                                }`}>
                                {borrow.status}
                                </span>
                                </td>


                                <td className="p-3 flex justify-center gap-2">

                                <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                onClick={(e)=>fill_BorrowData(e,borrow.borrowId)}
                                >
                                Edit
                                </button>


                                <button
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                onClick={(e)=>remove_Borrow(e,borrow.borrowId)}
                                >
                                Delete
                                </button>

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