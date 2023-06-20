// mongoose and dotenv
const mongoose = require("mongoose");
require("dotenv").config();
const DB_URI = process.env.MONGODB_URI;

// mongoose config and connection
mongoose.set("strictQuery", false);
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) =>
    console.log("Error connecting to Mongoose server: ", err.message)
  );

// create mongoose schema for contacts
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 2 },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: "Invalid email format",
    },
  },
});

contactSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

// create mongoose contact Model
module.exports = mongoose.model("Contact", contactSchema);
