import api from "./api";

const getCategories = () => {
    return api.get("/categories");
};

const createCategory = (categoryData) => {
    return api.post("/categories", categoryData);
};

const updateCategory = (id, categoryData) => {
    return api.patch(`/categories/${id}`,categoryData)
}

export default {
    getCategories,
    createCategory,
    updateCategory
};