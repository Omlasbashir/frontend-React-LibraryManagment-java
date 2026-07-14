import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import api from "../services/api";

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
        setRegisterStatus("Register");
    };

    // register new book / update book
    const register_New_Book = async (e) => {
        e.preventDefault();

        try {

            const postData = {
                title: title,
                author: author,
                isbn: isbn,
                categoryId: categoryId,
                quantity: quantity,
            };


            if (registerStatus === "Register") {

                await api.post(
                    "/books",
                    postData
                );

            } else {

                await api.put(
                    `/books/${bookId}`,
                    postData
                );

            }


            alert("Success");
            ClearData();
            load_Books();


        } catch (error) {

            console.log(error);

        }
    };

    // fill book data for update
    const fill_BookData = async (e, id) => {

        e.preventDefault();

        try {

            const response = await api.get(
                `/books/${id}`
            );


            setBookId(
                response.data.bookId
            );

            setTitle(
                response.data.title
            );

            setAuthor(
                response.data.author
            );

            setIsbn(
                response.data.isbn
            );

            setCategoryId(
                response.data.categoryId
            );

            setQuantity(
                response.data.quantity
            );

            setRegisterStatus("Update");


        } catch (error) {

            console.log(error);

        }
    };

    // loading books -> store in usestate
    const load_Books = async () => {

        try {

            const response = await api.get(
                "/books"
            );


            setBooks(response.data);


        } catch (error) {

            console.log(error);

        }
    };

    // loading categories -> for dropdown
    const load_Categories = async () => {

        try {

            const response = await api.get(
                "/categories"
            );


            setCategories(response.data);


        } catch (error) {

            console.log(error);

        }
    };

    // delete book
    const remove_book = async (e, id, title) => {

        e.preventDefault();

        const confirmDelete = confirm(
            `Delete ${title}?`
        );

        if (confirmDelete) {

            try {

                await api.delete(
                    `/books/${id}`
                );


                alert("Deleted Successfully");

                load_Books();


            } catch (error) {

                console.log(error);

            }

        }
    };

    useEffect(() => {
        load_Books();
        load_Categories();
    }, []);

    //search
    const filteredBooks = books.filter((book) =>
        book.title?.toLowerCase().includes(search.toLowerCase())
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
                                    required
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
                                    required
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
                                    required
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
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.categoryId} value={cat.categoryId}>
                                            {cat.categoryId} - {cat.categoryName}
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
                                <button type="button" onClick={ClearData} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg w-full">
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
                                                onClick={(e) => remove_book(e, book.bookId, book.title)}> Delete
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