const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("build"));
// Custom Middleware
const requestLogger = (req, res, next) => {
  console.log(`Request Method: ${req.method}`);
  console.log(`Request Path: ${req.path}`);
  Object.keys(req.body).length !== 0 && console.log(`Request Body:`, req.body);
  next();
};
// Implementing the Middleware
app.use(requestLogger);

// Hardcoded contacts data
let contacts = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" },
];

// Route handler for "/api/contacts"
app.get("/api/contacts", (req, res) => {
  res.json(contacts);
});

app.get("/api/info", (req, res) => {
  const numContacts = contacts.length;
  const appName = "Contacts Web Server";

  const response = `<h1>${appName}</h1>
    <p>Number of contacts: ${numContacts}</p>`;

  res.send(response);
});

app.get("/api/contacts/:id", (req, res) => {
  const contactId = Number(req.params.id);
  const contact = contacts.find((contact) => contact.id === contactId);

  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ error: "Contact not found" });
  }
});

app.delete("/api/contacts/:id", (req, res) => {
  const contactId = Number(req.params.id);
  const contact = contacts.find((contact) => contact.id === contactId);

  if (contact) {
    contacts = contacts.filter((c) => c.id !== contactId);
    res.sendStatus(204);
    // Success response with status 204 (No Content)
  } else {
    res.status(404).json({ error: "Contact not found" });
    // Response with status 404 (Not Found)
  }
});

app.post("/api/contacts", (req, res) => {
  const { name, email } = req.body;
  // Check if name and email are provided
  if (!name || !email) {
    return res
      .status(400)
      .json({ error: "Name and email are required fields" });
  }
  // Check if email already exists in contacts
  const existingContact = contacts.find((contact) => contact.email === email);
  if (existingContact) {
    return res.status(409).json({ error: "Email address already exists" });
  }
  // Generate unique ID for the new contact
  const id = `${Math.random().toString(36).substring(2, 9)}${Date.now()}`;
  // Create the new contact object
  const newContact = { id, name, email };
  // Add the new contact to the contacts list
  contacts.push(newContact);
  // Send success response with the newly created contact
  res.status(201).json(newContact);
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server is running on port 3001");
});
