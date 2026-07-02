import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Books() {

    // search
    const [search, setSearch] = useState("");

    // book parameters
    const [bookId, setBookId] = useState(0);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [isbn, setIsbn] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [quantity, setQuantity] = useState(0);

    // categories list (loodhan dropdown)
    const [categories, setCategories] = useState([]);

    const [registerStatus, setRegisterStatus] = useState("Register");

    const [books, setBooks] = useState([]);

    // clear form data
    const ClearData = () => {
        setBookId(0);
        setTitle("");
        setAuthor("");
        setIsbn("");
        setCategoryId("");
        setQuantity(0);
        load_Books();
        setRegisterStatus("Register");
    };

    // register new book / update book
    const register_New_Book = async (e) => {
        e.preventDefault();
        try {
            let postData = {
                "title": title,
                "author": author,
                "isbn": isbn,
                "categoryId": categoryId,
                "quantity": quantity,
            };

            let response;

            if (registerStatus === "Register") {
                response = await axios.post(`https://localhost:7019/api/Books`, postData);
            } else if (registerStatus === "Update") {
                postData.bookId = bookId;
                response = await axios.put(`https://localhost:7019/api/Books`, postData);
            }

            let result = response.data;
            if (result.status) {
                ClearData();
            } else {
                alert(`error: ${result.message}`);
            }
        } catch (error) {
            console.log(`exeptian: ${error}`);
        }
    };

    // fill book data for update
    const fill_BookData = async (e, bookId) => {
        e.preventDefault();
        try {
            const response = await axios.get(`https://localhost:7019/api/Books/${bookId}`);
            const result = response.data;
            if (result.status) {
                setBookId(result.data.bookId);
                setTitle(result.data.title);
                setAuthor(result.data.author);
                setIsbn(result.data.isbn);
                setCategoryId(result.data.categoryId);
                setQuantity(result.data.quantity);
                setRegisterStatus("Update");
            } else {
                console.log(result.message);
            }
        } catch (error) {
            console.log(`exeptian: ${error}`);
        }
    };

    // loading books -> store in usestate
    const load_Books = async () => {
        try {
            const response = await axios.get(`https://localhost:7019/api/Books`);
            const result = response.data;
            if (result.status) {
                setBooks(result.data);
            } else {
                console.log(result.message);
            }
        } catch (error) {
            console.log(`exeptian: ${error}`);
        }
    };

    // loading categories -> for dropdown
    const load_Categories = async () => {
        try {
            const response = await axios.get(`https://localhost:7019/api/Categories`);
            const result = response.data;
            if (result.status) {
                setCategories(result.data);
            } else {
                console.log(result.message);
            }
        } catch (error) {
            console.log(`exeptian: ${error}`);
        }
    };

    // delete book
    const remove_book = async (e, title, bookId) => {
        e.preventDefault();

        try {
            const sure = confirm(`Are you sure you want to delete book: ${title}?`);
            if (sure) {
                const response = await axios.delete(`https://localhost:7019/api/Books/${bookId}`);
                const result = response.data;
                if (result.status) {
                    alert(`Success: ${result.message}`);
                    load_Books();
                } else {
                    alert(`Error: ${result.message}`);
                }
            }
        } catch (error) {
            console.log(`Exception: ${error}`);
        }
    };

    useEffect(() => {
        load_Books();
        load_Categories();
    }, []);

    //search
    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
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
                            <h1 className="text-3xl font-bold text-gray-800"> 📚 Books </h1>
                            <p className="text-gray-500 text-sm"> Manage library books collection</p>
                        </div>
                    </div>

                    {/* SEARCH + STATS */}
                    <div className="flex justify-between mb-4">

                        <input
                            type="text"
                            className="border px-3 py-2 rounded w-1/3"
                            placeholder="Search books..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <div className="bg-white px-4 py-2 rounded shadow text-sm">
                            Total Books: <b>{filteredBooks.length}</b>
                        </div>

                    </div>

                    {/* ADD / UPDATE BOOK FORM */}
                    <form onSubmit={register_New_Book} className="bg-white shadow-lg rounded-xl p-6 mb-6">

                        <h2 className="text-xl font-bold text-gray-800 mb-5">
                            {registerStatus === "Register" ? "Add New Book" : "Update Book"}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter book title..."
                                    onChange={(e) => setTitle(e.target.value)}
                                    value={title}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">
                                    Author
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter author name..."
                                    onChange={(e) => setAuthor(e.target.value)}
                                    value={author}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">
                                    ISBN
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter ISBN..."
                                    onChange={(e) => setIsbn(e.target.value)}
                                    value={isbn}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">
                                    CategoryId
                                </label>
                                <select value={categoryId}  onChange={(e) => setCategoryId(e.target.value)}className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.categoryId} value={cat.categoryId}>
                                            {cat.categoryId} 
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    value={quantity}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="flex gap-2 md:col-span-2">
                                <button type="submit" className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-lg w-full">
                                    {registerStatus === "Register" ? "Add Book" : "Update Book"}
                                </button>
                                <button type="button" onClick={ClearData} className="bg-gray-900 hover:bg-gray-600 text-white px-6 py-3 rounded-lg w-full">
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
                                    <th className="p-3 text-left">Title</th>
                                    <th className="p-3 text-left">Author</th>
                                    <th className="p-3 text-left">ISBN</th>
                                    <th className="p-3 text-left">CategoryId</th>
                                    <th className="p-3 text-left">Qty</th>
                                    <th className="p-3 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredBooks.map((book) => (
                                    <tr key={book.bookId} className="border-b hover:bg-gray-50">

                                        <td className="p-3">{book.bookId}</td>
                                        <td className="p-3 font-semibold text-gray-800">{book.title}</td>
                                        <td className="p-3 text-gray-600"> {book.author} </td>
                                        <td className="p-3 text-gray-600"> {book.isbn} </td>

                                        <td className="p-3">
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                                                {book.categoryId}
                                            </span>
                                        </td>

                                        <td className="p-3 text-gray-600">{book.quantity}</td>

                                        <td className="p-3 flex justify-center gap-2">
                                            <button
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                                onClick={(e) => fill_BookData(e, book.bookId)}> Edit
                                            </button>

                                            <button
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                                onClick={(e) => remove_book(e, book.title, book.bookId)}> Delete
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