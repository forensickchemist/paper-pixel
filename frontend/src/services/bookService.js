import api from "./api";

const getBooks = () => {
    return api.get("/books");
};

const getBook = (bookId) => {
    return api.get(`/books/${bookId}`);
};

const createBook = (bookData) => {
    return api.post("/books", bookData);
};

const searchBooksByTitle = (title) => {
    return api.post("/books/search/title", {
        title,
    });
};

const updateBook = (bookId, bookData) => {
    return api.patch(`/books/${bookId}`, bookData);
};

const getFeaturedBooks = () => {
    return api.get("/books/featured");
};

export default {
    getBooks,
    getBook,
    createBook,
    searchBooksByTitle,
    updateBook,
    getFeaturedBooks
};