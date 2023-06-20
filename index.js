// mongoose model and dotenv configuration
const Contact = require("./models/contact");
require("dotenv").config();

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
  console.log("--------------------------------");
  next();
};
// Implementing the Middleware
app.use(requestLogger);

// Route handler for "/api/contacts"
app.get("/api/contacts", async (req, res) => {
  const contacts = await Contact.find({});
  res.json(contacts);
});

app.get("/api/info", (req, res) => {
  const numContacts = contacts.length;
  const appName = "Contacts Web Server";

  const response = `<h1>${appName}</h1>
    <p>Number of contacts: ${numContacts}</p>`;

  res.send(response);
});

app.get("/api/contacts/:id", async (req, res) => {
  const contact = await Contact.findById(req.params.id);

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

app.post("/api/contacts", async (req, res) => {
  const { name, email } = req.body;
  // Check if name and email are provided
  if (!name || !email) {
    return res
      .status(400)
      .json({ error: "Name and email are required fields" });
  }
  // Create the new contact Mongoose object
  const contact = new Contact({ name, email });
  // save the contact to the database
  const newContact = await contact.save();
  // Send the new contact with response
  res.status(201).json(newContact);
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server is running on port 3001");
});
