const express = require('express');
const axios = require('axios'); // Import Axios for HTTP requests

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Task 10: Get all books (updated to use async/await with Axios)
public_users.get('/', async (req, res) => {
  try {
    // Use Axios to fetch books (simulating getting data from an external API)
    const response = await axios.get('http://localhost:5000/books'); // Replace with your actual URL
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books", error: error.message });
  }
});

// Task 11: Get book details by ISBN (updated to use async/await with Axios)
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`); // Replace with your actual URL
    if (response.data) {
      return res.status(200).json(response.data);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(404).json({ message: "Book not found", error: error.message });
  }
});

// Task 12: Get book details by author (updated to use async/await with Axios)
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`); // Replace with your actual URL
    if (response.data.length > 0) {
      return res.status(200).json(response.data);
    } else {
      return res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    return res.status(404).json({ message: "No books found for this author", error: error.message });
  }
});

// Task 13: Get book details by title (updated to use async/await with Axios)
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`); // Replace with your actual URL
    if (response.data.length > 0) {
      return res.status(200).json(response.data);
    } else {
      return res.status(404).json({ message: "No books found for this title" });
    }
  } catch (error) {
    return res.status(404).json({ message: "No books found for this title", error: error.message });
  }
});

// Task 5: Get book reviews by ISBN (no change needed here, this is a local check)
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Reviews not found" });
  }
});

module.exports.general = public_users;
