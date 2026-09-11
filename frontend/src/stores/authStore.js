import { defineStore } from "pinia";
import { ref, computed } from "vue";
import authService from "@/services/authService";
import { getApiError } from "@/utils/apiError";


export const useAuthStore = defineStore("auth", () => {

    const accessToken = ref(localStorage.getItem("accessToken"));
    const user = ref(null);
    
    const getCurrentUser = async () => {
        try {
            const response = await authService.getCurrentUser();
            user.value = response.data.user;
            return response;
        } catch (error) {
            throw getApiError(error);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);

            accessToken.value = response.data.access;
            localStorage.setItem("accessToken", accessToken.value);

            await getCurrentUser();

            return response;
        } catch (error) {
            throw getApiError(error);
        }
    };

    const logout = () => {
        accessToken.value = null;
        user.value = null;

        localStorage.removeItem("accessToken");
    };

    const isAuthenticated = computed(() => !!accessToken.value);

    async function register(userData) {
        try {
            return await authService.register(userData);
        } catch (error) {
            throw getApiError(error);
        }
    };

    return {
        accessToken,
        user,
        login,
        logout,
        getCurrentUser,
        isAuthenticated,
        register,
    };
});