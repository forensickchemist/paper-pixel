import api from "./api";

const getAuthors = () => {
    return api.get("/authors");
};

const createAuthor = (authorData) => {
    return api.post("/authors", authorData);
};

const updateAuthor = (id, authorData) => {
    return api.patch(`/authors/${id}`, authorData);
};

export default {
    getAuthors,
    createAuthor,
    updateAuthor,
};

