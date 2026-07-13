import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7019/api",
});

export default api;