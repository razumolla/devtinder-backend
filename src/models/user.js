const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var validator = require('validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

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
    unique: true, // specifying `index: true` is optional if you do `unique: true`
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
        throw new Error("Enter a strong password: 1 lowercase , 1 uppercase letter, 1 number, 1 special character");
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
    enum: {
      values: ["Male", "Female", "Other"],
      message: `{VALUE} is incorrect Gender` // custom error message
    },
    // validate(value) {
    //   if (!["Male", "Female", "Other"].includes(value)) {
    //     throw new Error("Invalid Gender" + value);
    //   }
    // },
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
    default: "I am a Good Person",
  },
  skills: {
    type: Array,
    default: ["Javascript", "NodeJS", "MongoDB"],
  },
}, { timestamps: true });

// compound index for searching with firstName and lastName
// userSchema.index({ firstName: 1, lastName: 1 });

// JWT token
userSchema.methods.getJWT = async function () {
  const user = this; // this refers to the user document

  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET,
    { expiresIn: process.env.EXPIRES_IN }
  );
  return token;
};

//validate password
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordValid;
};

module.exports = mongoose.model('User', userSchema);