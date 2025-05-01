const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session setup for storing user session
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Authentication middleware to check JWT token
app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: "No token provided. Access denied." });
  }

  jwt.verify(token, 'access', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token. Access denied." });
    }
    
    req.user = decoded; // Store the decoded token data in req.user
    next(); // Move to the next middleware or route handler
  });
});

// Register routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Server setup
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
