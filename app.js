require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Add this near the top, after creating the app
app.use(helmet());

// Sample data - in-memory storage
let books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { id: 2, title: "1984", author: "George Orwell" }
];

// GET all books
app.get('/api/books', (req, res) => {
    res.json(books);
});

// GET a specific book by ID
app.get('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
});

// POST a new book
app.post('/api/books', (req, res) => {
    if (!req.body.title || !req.body.author) {
        return res.status(400).json({ error: "Title and author are required" });
    }

    const newBook = {
        id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
        title: req.body.title,
        author: req.body.author
    };
    
    books.push(newBook);
    res.status(201).json(newBook);
});

// PUT/UPDATE a book
app.put('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    if (!req.body) {
        return res.status(400).json({ error: "Bad request" });
    }

    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    
    res.json(book);
});

// DELETE a book
app.delete('/api/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) {
        return res.status(404).json({ error: "Book not found" });
    }

    books.splice(bookIndex, 1);
    res.json({ message: "Book deleted" });
});

// Add this before your routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 