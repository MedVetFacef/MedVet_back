import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Informe seu nome"],
      maxLength: [50, "O nome não pode ter mais de 50 caracteres"],
    },
    email: {
      type: String,
      required: [true, "Informe seu email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Informe sua senha"],
      minLength: [6, "A senha deve ter no mínimo 6 caracteres"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJwtToken = function () {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET não configurada no servidor");
  }
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME || '7d',
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
