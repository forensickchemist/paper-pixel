import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "@/assets/styles/variables.css";
import "@/assets/styles/base.css";
import "@/assets/styles/main.css";

import "@/assets/styles/components/buttons.css";
import "@/assets/styles/components/forms.css";
import "@/assets/styles/components/badges.css";
import "@/assets/styles/components/books.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router/index.js";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");