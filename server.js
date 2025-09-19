require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");

const errorHandler = require("./middleware/errorHandler");
const userRouter = require("./routes/userRoute");
const profileRouter = require("./routes/profile");
const connectionRouter = require("./routes/connectionRequest");
require("./config/db");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cookieParser());

app.use("/user", userRouter);
app.use("/", profileRouter);
app.use("/connection", connectionRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
