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
// error handler middleware
const errorHandler = (err, req, res, next) => {
  console.log(err.message);
  console.log("--------------------------------");
  if (err.name === "CastError") {
    return res.status(400).json({ error: "invalid id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

// Route handler for "/api/contacts"
app.get("/api/contacts", async (req, res, error) => {
  try {
    const contacts = await Contact.find({});
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

app.get("/api/info", async (req, res, next) => {
  try {
    const contacts = await Contact.find({});
    const numContacts = contacts.length;
    const appName = "Contacts Web Server";
    const response = `<h1>${appName}</h1>
    <p>Number of contacts: ${numContacts}</p>`;
    res.send(response);
  } catch (error) {
    next(error);
  }
});

app.get("/api/contacts/:id", async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ error: "Contact not found" });
    }
  } catch (error) {
    next(error);
  }
});

app.delete("/api/contacts/:id", async (req, res, next) => {
  try {
    const result = await Contact.findByIdAndRemove(req.params.id);
    if (result) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Contact not found" });
    }
  } catch (error) {
    next(error);
  }
});

app.put("/api/contacts/:id", async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    );
    if (updatedContact) {
      res.json(updatedContact);
    } else {
      res.status(404).json({ error: "Contact not found" });
    }
  } catch (error) {
    next(error);
  }
});

app.post("/api/contacts", async (req, res, next) => {
  const { name, email } = req.body;
  // Check if name and email are provided
  if (!name || !email) {
    return res
      .status(400)
      .json({ error: "Name and email are required fields" });
  }
  // Create the new contact Mongoose object
  const contact = new Contact({ name, email });
  try {
    // save the contact to the database
    const newContact = await contact.save();
    // Send the new contact with response
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

// implement error handler middleware
app.use(errorHandler);
// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server is running on port 3001");
});
