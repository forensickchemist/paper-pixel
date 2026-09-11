import { useAuthStore } from "@/stores/authStore";

import {
    createRouter,
    createWebHistory
} from "vue-router";

import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import BooksCatalogView from "@/views/BooksCatalogView.vue";
import BookDetailsView from "@/views/BookDetailsView.vue";
import AdminDashboardView from "@/views/AdminDashboardView.vue";
import CartView from "@/views/CartView.vue";
import CheckoutView from "@/views/CheckoutView.vue";
import OrderHistoryView from "@/views/OrderHistoryView.vue";


const router = createRouter({

    history: createWebHistory(
        import.meta.env.BASE_URL
    ),

    routes: [

        {
            path: "/",
            name: "home",
            component: HomeView
        },

        {
            path: "/books",
            name: "booksCatalog",
            component: BooksCatalogView
        },

        {
            path: "/login",
            name: "login",
            component: LoginView
        },

        {
            path: "/register",
            name: "register",
            component: RegisterView
        },

        {
            path: "/get-cart",
            name: "cart",
            component: CartView,
            meta: {
                requiresAuth: true
            }
        },

        {
            path: "/checkout",
            name: "checkout",
            component: CheckoutView,
            meta: {
                requiresAuth: true
            }
        },

        {
            path: "/orders",
            name: "orders",
            component: OrderHistoryView,
            meta: {
                requiresAuth: true
            }
        },

        {
            path: "/books/:id",
            name: "bookDetails",
            component: BookDetailsView
        },

        {
            path: "/admin",
            name: "admin-dashboard",
            component: AdminDashboardView,
            meta: {
                requiresAuth: true,
                requiresAdmin: true
            }
        },

        { 
            path: "/community", 
            name: "community", 
            component: () => 
                import("@/views/CommunityView.vue") 
        },
        
        {
            path: "/community/:slug",
            name: "communityDetail",
            component: () => import("@/views/CommunityDetailView.vue")
        }

    ]
});


router.beforeEach((to) => {

    const authStore = useAuthStore();

    if (
        to.meta.requiresAuth &&
        !authStore.isAuthenticated
    ) {
        return {
            name: "login"
        };
    }

    if (
        to.meta.requiresAdmin &&
        authStore.user?.role !== "admin"
    ) {
        return {
            name: "home"
        };
    }

});


export default router;