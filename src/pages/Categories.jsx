import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

import api from "../services/api";
export default function Categories() {
    //search
    const [search, setSearch] = useState("");

    //categories parameter
    const [categoryId , setCategoryId] = useState(0);
    const [categoryName , setCategoryName] = useState("");



    const [registerStatus, setRegisterStatus] = useState("Register");
    //clear data
    const ClearData = () =>{
        setCategoryId(0);
        setCategoryName("");
        load_Categories();
        setRegisterStatus("Register");

    }

    const [categories, setCategories] = useState([]);

    //register new category  and update
    const register_New_Category = async (e) => {
        e.preventDefault();
        try{
            let postData = {
                "categoryName": categoryName,
                // "createdDate": ""
            }   
            
            let response
            
            if(registerStatus == "Register"){
                response = await api.post(`/Categories`, postData) 
            }else if(registerStatus == "Update"){
                postData.categoryId = categoryId
                response = await api.put(`/Categories`, postData)
            }
            let result = response.data
            if(result.status){
                // alert(`success: ${result.message}`)
                ClearData();
            }else{
                alert(`error: ${result.message}`)
            } 
        }catch (error) {
            console.log(`exeptian: ${error}`);
        }
    }

    //fill category data for update
    const fill_CategoryDate = async (e, categoryId) => {
        e.preventDefault();
        try {
            const response = await api.get(`/Categories/${categoryId}`)
            const result = response.data
            if(result.status){
                setCategoryId(result.data.categoryId);
                setCategoryName(result.data.categoryName);
                setRegisterStatus("Update");
            }else{
                console.log(result.message)
            }
        }catch (error) {
            console.log(`exeptian: ${error}`);
        }
    }

    //lading categories store usesate
    const load_Categories = async () => {
        try {
            const response = await api.get(`/Categories`)
            const result = response.data
            if(result.status){
                setCategories(result.data)
            }else{
                console.log(result.message)
            }
        }catch (error) {
            console.log(`exeptian: ${error}`);
        }

    }

    //delete category
    const remove_category = async (e, categoryName, categoryId) => {
    e.preventDefault();

    try {
        const sure = confirm(`Are you sure you want to delete category: ${categoryName}?`);
        if (sure) {
            const response = await api.delete(`/Categories/${categoryId}`);
            const result = response.data;
            if (result.status) {     
                alert(`Success: ${result.message}`);
                load_Categories();
            } else {
                alert(`Error: ${result.message}`);
            }
        }
    } catch (error) {

        console.log(`Exception: ${error}`);

    }
}

    useEffect(() => {
        load_Categories()
    } ,[])


    const filteredCategories = categories.filter((category) =>
    category.categoryName
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
                            <h1 className="text-3xl font-bold text-gray-800"> Categories </h1>    
                        </div>

                    </div>

                    {/* SEARCH MOCK */}
                    <div className="flex justify-between mb-4">

                        <input
                            type="text"
                            className="border px-3 py-2 rounded w-1/3"
                            placeholder="Search category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <div className="bg-white px-4 py-2 rounded shadow text-sm">
                            Total:<b>{filteredCategories.length}</b>
                        </div>

                    </div>
                    {/* ADD CATEGORY FORM */}

                    <form  onSubmit={register_New_Category} className="bg-white shadow-lg rounded-xl p-6 mb-6">

                        <h2 className="text-xl font-bold text-gray-800 mb-5">
                            {
                                registerStatus === "Register" ? "Add New Category" : "Update Category"
                            }
                           
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

                            <div className="md:col-span-2">

                                <label className="block mb-2 text-sm font-semibold text-gray-700">
                                    Category Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter category name..."
                                    onChange={(e) => setCategoryName(e.target.value)} 
                                    value = {categoryName}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />

                            </div>

                            <button type="submit" className="bg-gray-900 hover:bg-gray-500 text-white px-6 py-3 rounded-lg w-full">
                                {registerStatus === "Register"
                                    ? "Add Category"
                                    : "Update Category"}
                            </button>

                            <div className="flex gap-2">
                                <button type="reset" className="bg-gray-900 hover:bg-gray-600 text-white px-6 py-3 rounded-lg w-full"> Clear </button>
                            </div>
                            

                        </div>

                    </form>

                    {/* TABLE */}
                    <div className="bg-white shadow rounded-xl overflow-hidden">

                        <table className="w-full">

                            <thead className="bg-gray-900 text-white">
                                <tr>
                                    <th className="p-3 text-left">ID</th>
                                    <th className="p-3 text-left">Category</th>
                                    <th className="p-3 text-left">Date</th>
                                    <th className="p-3 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    filteredCategories.map((category) => (
                                        <tr key={category.categoryId} className="border-b hover:bg-gray-50">

                                            <td className="p-3">{category.categoryId}</td>

                                            <td className="p-3 font-medium">{category.categoryName}</td>

                                            <td className="p-3 text-gray-500">{category.createdDate}</td>

                                            <td className="p-3 flex justify-center gap-2">
                                                <button type="submit" className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={(e) => fill_CategoryDate(e, category.categoryId)}>Edit</button>
                                                <button type="submit" className="bg-red-600 text-white px-3 py-1 rounded" onClick={(e) => remove_category ( e, category.categoryName ,category.categoryId)}>Delete</button>
                                            </td>

                                        </tr>
                                    ))
                                }
                                
                                
                            </tbody>

                        </table>

                    </div>

                    

                </div>

               

            </div>
        </div>
    );
}