// Get book review by ISBN
app.get("/books/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);

    if (book) {
        res.json({
            isbn: book.isbn,
            title: book.title,
            reviews: book.reviews || {}
        });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});
