import axios from "axios";

// Backend URLs
const JAVA_API = "http://localhost:7766/api";
const CSHARP_API = "https://localhost:7019/api";


// Axios instance
const api = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});


let activeApi = null;


// Detect Backend
const detectBackend = async () => {

    if (activeApi) return activeApi;


    try {

        await axios.get(
            `${JAVA_API}/categories`,
            { timeout: 3000 }
        );

        activeApi = JAVA_API;

        console.log("Java Backend Connected");


    } catch {


        try {

            await axios.get(
                `${CSHARP_API}/Categories`,
                { timeout: 3000 }
            );


            activeApi = CSHARP_API;

            console.log("C# Backend Connected");


        } catch {

            throw new Error(
                "No Backend Connected"
            );

        }

    }


    return activeApi;

};



// Request interceptor
api.interceptors.request.use(
    async (config)=>{


        config.baseURL = await detectBackend();


        const token = localStorage.getItem("token");


        if(token){

            config.headers.Authorization =
            `Bearer ${token}`;

        }


        return config;


    }
);



// Response interceptor
api.interceptors.response.use(

(response)=>response,


(error)=>{


    if(error.response?.status === 401){

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");


        window.location.href="/login";

    }


    return Promise.reject(error);

}

);



// ================= AUTH =================

export const login = (data)=>
    api.post("/auth/login", data);



export const register = (data)=>
    api.post("/auth/register", data);



// ================= USERS =================

export const getUsers = () =>
    api.get("/user");

export const addUser = (data) =>
    api.post("/user",data);

export const updateUser = (id,data)=>
    api.put(`/user/${id}`,data);

export const deleteUser = (id)=>
    api.delete(`/user/${id}`);



// ================= CATEGORIES =================

export const getCategories = () =>
    api.get("/categories");


export const addCategory = (data)=>
    api.post("/categories",data);


export const updateCategory = (id,data)=>
    api.put(`/categories/${id}`,data);


export const deleteCategory = (id)=>
    api.delete(`/categories/${id}`);



// ================= BOOKS =================

export const getBooks = () =>
    api.get("/books");


export const addBook = (data)=>
    api.post("/books",data);


export const updateBook = (id,data)=>
    api.put(`/books/${id}`,data);


export const deleteBook = (id)=>
    api.delete(`/books/${id}`);


export const getBookById = (id)=>
    api.get(`/books/${id}`);


// ================== MEMBERS =================//
export const getMembers = () =>
    api.get("/members");

export const addMember = (data)=>
    api.post("/members",data);

export const updateMember = (id,data)=>
    api.put(`/members/${id}`,data); 

export const deleteMember = (id)=>
    api.delete(`/members/${id}`);


export const getMemberById = (id)=>
    api.get(`/members/${id}`);


// ================ BORROW TRANSACTIONS =================//
export const getBorrowTransactions = () =>
    api.get("/BorrowTransactions");

export const addBorrowTransaction = (data)=>
    api.post("/BorrowTransactions",data);

export const updateBorrowTransaction = (id,data)=>
    api.put(`/BorrowTransactions/${id}`,data);

export const deleteBorrowTransaction = (id)=>
    api.delete(`/BorrowTransactions/${id}`);    

export const getBorrowTransactionById = (id)=>
    api.get(`/BorrowTransactions/${id}`);

// Logout

export const logout = ()=>{

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

};



export default api;