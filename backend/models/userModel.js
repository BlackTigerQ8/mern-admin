import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Validate that the postalCode does not contain a comma
          return !value.includes(",");
        },
        message: "Postal code should not contain a comma",
      },
    },
    profileImage: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    accessLevel: {
      type: Number,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual property to calculate the fullName
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Remove comma from postalCode field
  this.postalCode = this.postalCode.replace(/,/g, "");

  next();
});

// Update profile image path
userSchema.methods.updateProfileImage = function (imagePath) {
  this.profileImage = imagePath;
};

const User = mongoose.model("User", userSchema);

export default User;
