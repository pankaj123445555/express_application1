const express = require("express");
const app = express();
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();
require("./config/db");
const userRouter = require("./routes/userRoute");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const Port = process.env.PORT;

app.use(express.json());
app.use("/user", userRouter);

app.listen(Port, () => console.log("Server running on 3000"));

app.use("/user", errorHandler);
