const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./route/user.route")
const { ConnectToDB } = require("./config/db.config");
dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json()); 

// Routes
app.use('/users', userRoutes);

// Basic home route page for testing
app.get("/", (req, res) => {
  res.send("Home page for study nest");
});

// server is connected to db and running on port make sure you have port and mongo db uri in your .env file
app.listen(PORT, async () => {
  try {
    await ConnectToDB.then((res) =>
      console.log("Server is connected to db successfully")
    ).catch((err) => console.log(`DB hacve some problem ${err}`));
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log("Server have some problem while connecting", error);
  }
});
