import api from "./api";


/* ==========================================
   Get All Book Formats
========================================== */

const getAllBookFormats = () => {
    return api.get("/book-formats");
};


/* ==========================================
   Get Formats By Book
========================================== */

const getBookFormatsByBook = (bookId) => {
    return api.get(`/book-formats/book/${bookId}`);
};


/* ==========================================
   Create Book Format
========================================== */

const createBookFormat = (bookFormatData) => {
    return api.post("/book-formats", bookFormatData);
};


/* ==========================================
   Update Book Format
========================================== */

const updateBookFormat = (bookFormatId, bookFormatData) => {
    return api.patch(
        `/book-formats/${bookFormatId}`,
        bookFormatData
    );
};


/* ==========================================
   Deactivate Book Format
========================================== */

const deactivateBookFormat = (bookFormatId) => {
    return api.patch(
        `/book-formats/${bookFormatId}/deactivate`
    );
};


/* ==========================================
   Activate Book Format
========================================== */

const activateBookFormat = (bookFormatId) => {
    return api.patch(
        `/book-formats/${bookFormatId}/activate`
    );
};


export default {
    getAllBookFormats,
    getBookFormatsByBook,
    createBookFormat,
    updateBookFormat,
    deactivateBookFormat,
    activateBookFormat
};