import mongoose from "mongoose";

export const connectDatabase = () => {
  const DB_URI = process.env.DB_URI;

  mongoose
    .connect(DB_URI)
    .then((con) => {})
    .catch((err) => {});
};