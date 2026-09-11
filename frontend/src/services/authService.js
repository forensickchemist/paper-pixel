// Responsible for making HTTP requests
import api from "./api";

const login = (userData) => {
    return api.post("/users/login", userData);
};

const getCurrentUser = () => {
    return api.get("/users/details");
};

const register = (userData) => {
    return api.post("/users/register", userData);
}

export default {
    login,
    getCurrentUser,
    register,
};