import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function Categories() {

    const [search, setSearch] = useState("");

    const [categoryId, setCategoryId] = useState(0);
    const [categoryName, setCategoryName] = useState("");

    const [registerStatus, setRegisterStatus] = useState("Register");

    const [categories, setCategories] = useState([]);


    // Clear Form
    const ClearData = () => {
        setCategoryId(0);
        setCategoryName("");
        setRegisterStatus("Register");
    };


    // Add / Update Category
    const register_New_Category = async (e) => {
        e.preventDefault();

        try {

            const postData = {
                categoryName: categoryName
            };


            if(registerStatus === "Register") {

                await api.post(
                    "/categories",
                    postData
                );

            } else {

                await api.put(
                    `/categories/${categoryId}`,
                    postData
                );

            }


            alert("Success");
            ClearData();
            load_Categories();


        } catch(error) {

            console.log(error);

        }
    };



    // Get All Categories
    const load_Categories = async () => {

        try {

            const response = await api.get(
                "/categories"
            );

            const list = Array.isArray(response.data)
                ? response.data
                : response.data?.data ?? [];

            setCategories(list);


        } catch(error) {

            console.log(error);
            setCategories([]);

        }

    };



    // Edit Category
    const fill_CategoryData = async (e, id) => {

        e.preventDefault();

        try {

            const response = await api.get(
                `/categories/${id}`
            );

            const data = response.data?.data ?? response.data;


            setCategoryId(
                data.categoryId
            );


            setCategoryName(
                data.categoryName
            );


            setRegisterStatus("Update");


        } catch(error){

            console.log(error);

        }

    };



    // Delete Category
    const remove_category = async (e,id,name)=>{

        e.preventDefault();


        const confirmDelete = confirm(
            `Delete ${name}?`
        );


        if(confirmDelete){

            try{

                await api.delete(
                    `/categories/${id}`
                );


                alert("Deleted Successfully");

                load_Categories();


            }catch(error){

                console.log(error);

            }

        }

    };



    useEffect(()=>{

        load_Categories();

    },[]);



    const filteredCategories = categories.filter(
        (category)=>
        category.categoryName
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );



    return (

        <div className="flex bg-gray-100 min-h-screen">


            <Sidebar />


            <div className="ml-64 w-full">


                <Navbar />


                <div className="p-8">


                    <h1 className="text-3xl font-bold mb-6">
                        Categories
                    </h1>



                    <div className="flex justify-between mb-5">


                        <input
                        type="text"
                        placeholder="Search category..."
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                        className="border px-3 py-2 rounded w-1/3"
                        />


                        <div className="bg-white px-5 py-2 rounded shadow">

                            Total:
                            <b>{filteredCategories.length}</b>

                        </div>


                    </div>




                    <form
                    onSubmit={register_New_Category}
                    className="bg-white shadow rounded-xl p-6 mb-6"
                    >


                        <h2 className="text-xl font-bold mb-5">

                            {
                            registerStatus === "Register"
                            ?
                            "Add New Category"
                            :
                            "Update Category"
                            }

                        </h2>



                        <input

                        type="text"

                        required

                        value={categoryName}

                        onChange={
                            (e)=>
                            setCategoryName(e.target.value)
                        }

                        placeholder="Category Name"

                        className="border p-3 rounded w-full mb-4"

                        />



                        <button

                        className="bg-gray-900 text-white px-6 py-3 rounded"

                        >

                        {
                        registerStatus === "Register"
                        ?
                        "Add Category"
                        :
                        "Update Category"
                        }


                        </button>



                        <button

                        type="button"

                        onClick={ClearData}

                        className="ml-3 bg-red-600 text-white px-6 py-3 rounded"

                        >

                        Clear

                        </button>


                    </form>





                    <div className="bg-white shadow rounded-xl overflow-hidden">


                        <table className="w-full">


                            <thead className="bg-gray-900 text-white">

                                <tr>

                                    <th className="p-3 text-left">
                                        ID
                                    </th>

                                    <th className="p-3 text-left">
                                        Category
                                    </th>

                                    <th className="p-3 text-left">
                                        Date
                                    </th>

                                    <th className="p-3 text-center">
                                        Action
                                    </th>


                                </tr>

                            </thead>



                            <tbody>


                            {
                            filteredCategories.map((category)=>(


                                <tr
                                key={category.categoryId}
                                className="border-b"
                                >


                                    <td className="p-3">
                                        {category.categoryId}
                                    </td>


                                    <td className="p-3">
                                        {category.categoryName}
                                    </td>


                                    <td className="p-3">
                                        {category.createdDate}
                                    </td>



                                    <td className="p-3 text-center">


                                        <button

                                        onClick={
                                            (e)=>
                                            fill_CategoryData(
                                                e,
                                                category.categoryId
                                            )
                                        }

                                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"

                                        >

                                        Edit

                                        </button>




                                        <button

                                        onClick={
                                            (e)=>
                                            remove_category(
                                                e,
                                                category.categoryId,
                                                category.categoryName
                                            )
                                        }

                                        className="bg-red-600 text-white px-3 py-1 rounded"

                                        >

                                        Delete

                                        </button>


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