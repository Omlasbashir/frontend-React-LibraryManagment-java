import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function Books() {
const [search, setSearch] = useState("");
const [bookId, setBookId] = useState(0);
const [title, setTitle] = useState("");
const [author, setAuthor] = useState("");
const [isbn, setIsbn] = useState("");
const [categoryId, setCategoryId] = useState("");
const [quantity, setQuantity] = useState(0);
const [categories, setCategories] = useState([]);
const [registerStatus, setRegisterStatus] = useState("Register");
const [books, setBooks] = useState([]);

const ClearData = () => {
    setBookId(0);
    setTitle("");
    setAuthor("");
    setIsbn("");
    setCategoryId("");
    setQuantity(0);
    setRegisterStatus("Register");
};

const load_Books = async () => {
    try {
        const response = await api.get("/books");
        setBooks(response.data?.data ?? response.data ?? []);
    } catch (error) {
        console.log(error);
        setBooks([]);
    }
};

const load_Categories = async () => {
    try {
        const response = await api.get("/categories");
        setCategories(response.data?.data ?? response.data ?? []);
    } catch (error) {
        console.log(error);
        setCategories([]);
    }
};

const register_New_Book = async (e) => {
    e.preventDefault();

    const selectedCategoryId = Number(categoryId);

    if (!selectedCategoryId || isNaN(selectedCategoryId)) {
        alert("Please select a category");
        return;
    }

    const postData = {
        title,
        author,
        isbn,
        categoryId: selectedCategoryId,
        quantity: Number(quantity)
    };

    try {

        if (registerStatus === "Register") {
            await api.post("/books", postData);
            alert("Book registered successfully");
        } else {
            await api.put(`/books/${bookId}`, postData);
            alert("Book updated successfully");
        }

        ClearData();
        await load_Books();

    } catch (error) {
        console.log(error.response?.data || error.message);

        alert(
            error.response?.data?.message ||
            "Something went wrong"
        );
    }
};

const fill_BookData = async (e, id) => {
    e.preventDefault();

    try {
        const response = await api.get(`/books/${id}`);
        const data = response.data?.data ?? response.data;

        console.log("BOOK DATA:", data);

        setBookId(data.bookId);
        setTitle(data.title || "");
        setAuthor(data.author || "");
        setIsbn(data.isbn || "");
        setQuantity(data.quantity || 0);

        let selectedCategoryId =
            data.categoryId ||
            data.category?.categoryId ||
            "";

        if (!selectedCategoryId && data.categoryName) {
            const category = categories.find(
                cat => cat.categoryName === data.categoryName
            );

            selectedCategoryId = category?.categoryId || "";
        }

        setCategoryId(String(selectedCategoryId));
        setRegisterStatus("Update");

    } catch (error) {
        console.log(
            error.response?.data ||
            error.message
        );
    }
};

const remove_book = async (e, id, title) => {
    e.preventDefault();

    if (!window.confirm(`Delete ${title}?`)) return;

    try {
        await api.delete(`/books/${id}`);
        alert("Deleted Successfully");
        await load_Books();
    } catch (error) {
        console.log(
            error.response?.data ||
            error.message
        );
    }
};

useEffect(() => {
    load_Books();
    load_Categories();
}, []);

const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(search.toLowerCase())
);

return (
    <div className="flex bg-gray-100 min-h-screen">

        <Sidebar />

        <div className="ml-64 w-full">
            <Navbar />

            <div className="p-8">

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            📚 Books
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Manage library books collection
                        </p>
                    </div>
                </div>

                <div className="flex justify-between mb-4">
                    <input
                        type="text"
                        className="border px-3 py-2 rounded w-1/3"
                        placeholder="Search books..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="bg-white px-4 py-2 rounded shadow text-sm">
                        Total Books:
                        <b className="ml-1">
                            {filteredBooks.length}
                        </b>
                    </div>
                </div>

                <form
                    onSubmit={register_New_Book}
                    className="bg-white shadow-lg rounded-xl p-6 mb-6"
                >

                    <h2 className="text-xl font-bold text-gray-800 mb-5">
                        {registerStatus === "Register"
                            ? "Add New Book"
                            : "Update Book"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                        <input
                            type="text"
                            required
                            placeholder="Enter book title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-3"
                        />

                        <input
                            type="text"
                            required
                            placeholder="Enter author name..."
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-3"
                        />

                        <input
                            type="text"
                            required
                            placeholder="Enter ISBN..."
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-3"
                        />

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        <select
                            required
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-3"
                        >
                            <option value="">
                                Select category
                            </option>

                            {categories.map((cat) => (
                                <option
                                    key={cat.categoryId}
                                    value={cat.categoryId}
                                >
                                    {cat.categoryId} - {cat.categoryName}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            min="0"
                            required
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(Number(e.target.value))
                            }
                            className="border border-gray-300 rounded-lg px-4 py-3"
                        />

                        <div className="flex gap-2 md:col-span-2">

                            <button
                                type="submit"
                                className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-lg w-full"
                            >
                                {registerStatus === "Register"
                                    ? "Add Book"
                                    : "Update Book"}
                            </button>

                            <button
                                type="button"
                                onClick={ClearData}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg w-full"
                            >
                                Clear
                            </button>

                        </div>

                    </div>

                </form>

                <div className="bg-white shadow rounded-xl overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-900 text-white">
                            <tr>
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3 text-left">Author</th>
                                <th className="p-3 text-left">ISBN</th>
                                <th className="p-3 text-left">Category</th>
                                <th className="p-3 text-left">Qty</th>
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredBooks.map((book) => (
                                <tr
                                    key={book.bookId}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-3">
                                        {book.bookId}
                                    </td>

                                    <td className="p-3 font-semibold">
                                        {book.title}
                                    </td>

                                    <td className="p-3 text-gray-600">
                                        {book.author}
                                    </td>

                                    <td className="p-3 text-gray-600">
                                        {book.isbn}
                                    </td>

                                    <td className="p-3">
                                        {book.categoryId ??
                                            book.category?.categoryId ??
                                            "-"}
                                    </td>

                                    <td className="p-3 text-gray-600">
                                        {book.quantity}
                                    </td>

                                    <td className="p-3 flex justify-center gap-2">

                                        <button
                                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            onClick={(e) =>
                                                fill_BookData(
                                                    e,
                                                    book.bookId
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="bg-red-600 text-white px-3 py-1 rounded"
                                            onClick={(e) =>
                                                remove_book(
                                                    e,
                                                    book.bookId,
                                                    book.title
                                                )
                                            }
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
