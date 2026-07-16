import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:7766/api",
});

export const login = (data) => {
    return api.post("/auth/login", data);
};

export const register = (data) => {
    return api.post("/auth/register", data);
};

export default api;