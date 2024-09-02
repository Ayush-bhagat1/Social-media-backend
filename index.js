const express = require("express")
const app = express()
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const { configDotenv } = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/user",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/posts",postRoute)

app.get("/", (req, res) => {
    res.send({"message": "welcome to home page"});
});

require('dotenv').config();

mongoose.connect(process.env.MONGO_URL).then(()=>console.log("database connected"))

app.listen(8000,()=>{
   console.log("server running")
}) 