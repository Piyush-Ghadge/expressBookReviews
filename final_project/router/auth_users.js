const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  // Check if the username and password are valid
  if (authenticatedUser(username, password)) {
    // Generate the JWT token
    const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });

    // Store the token in the session
    req.session.authorization = { accessToken, username };

    // Send the token as part of the response
    return res.status(200).json({
      message: "Login successful",
      token: accessToken // Send the token here
    });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // ISBN from URL parameter
  const review = req.body.review; // Review from the request body
  const username = req.session.authorization.username; // Username from session

  // Check if review is provided
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  // Check if the book with given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Update or add the review for the book
  books[isbn].reviews[username] = review;

  // Send success response
  return res.status(200).json({ message: "Review added/updated successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized. Please login first." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "No review found to delete for this user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
