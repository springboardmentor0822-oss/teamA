require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const petitionRoutes = require("./routes/petitionRoutes");
const pollRoutes = require("./routes/pollRoutes");
const reportRoutes = require("./routes/reportRoutes");
const officialRoutes = require("./routes/officialRoutes");



dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// routes

app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/petitions", petitionRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/officials", officialRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
