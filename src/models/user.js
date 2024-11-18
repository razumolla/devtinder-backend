const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var validator = require('validator');

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    lowercase: true,
    required: true,
    index: true,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email: " + value);
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Enter a strong password: 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character");
      }
    },
  },
  age: {
    type: Number,
    min: 12,
    max: 100,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["Male", "Female", "Other"].includes(value)) {
        throw new Error("Invalid Gender" + value);
      }
    },
  },
  photoUrl: {
    type: String,
    default: "https://med.gov.bz/wp-content/uploads/2020/08/dummy-profile-pic.jpg",
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid Photo URL");
      }
    },
  },
  about: {
    type: String,
    default: "I am a developer",
  },
  skills: {
    type: Array,
    default: ["Javascript", "NodeJS", "MongoDB"],
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);