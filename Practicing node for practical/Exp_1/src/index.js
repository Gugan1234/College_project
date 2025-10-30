const express = require("express");
const pasth = require("path");
const bcrypt = require("bcrypt");

const app = express();
const collection = require("./config");

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set("view engine", "ejs");
app.use(express.static('public'));
app.get("/", (req, res)=>{
    res.render("login");
})

app.get("/signup", (req, res)=>{
    res.render("signup");
})

app.post("/signup",async (req, res)=>{
    const data = {
        name : req.body.username,
        password: req.body.password
    }

    const userdata = await collection.insertMany(data);
    console.log(data);
} )

app.post("/logout", (req, res)=>{
    res.redirect("/");
})

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    // Find user in your database
    const user = await collection.findOne({ name: username });
    if (!user) {
        return res.send("User not found");
    }
    // Check password (if using bcrypt, compare hash)
    const isMatch = password === user.password; // Replace with bcrypt if hashed
    if (!isMatch) {
        return res.send("Incorrect password");
    }
    // On success, redirect to home
    res.render("home");
});


const port = 5000;
app.listen(port, ()=> {
    console.log("Server is running on port:",port);
})