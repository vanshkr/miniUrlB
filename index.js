import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import urlRoutes from "./routes/urls.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/user", userRoutes);
app.use("/url", urlRoutes);

const PORT = process.env.PORT;
const CONNECTION_URL = process.env.CONNECTION_URL;
app.get("/status", (req, res) => {
  res.send("Server is up and running!");
});
mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err.message);
    process.exit(1); // Exit with a non-zero code to indicate failure
  });
