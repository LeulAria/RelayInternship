const functions = require("firebase-functions")
const firebase = require("firebase")
const express = require("express")
const app = express()
const fbconfig = require("./utils/FBConfig")

firebase.initializeApp(fbconfig)

app.get("/", (req, res) => {
  res.send(
    `<h1 style="font-size:6vw;text-align:center;font-family:monospace;padding:6vw;
    box-shadow:0 0 10px 4px rgba(0,0,0,0.2);border-radius:2vw;margin:10%;">/RelayInternships API<h1>`
  );
})

// AUTHENTICATIONS
// Signing into application
app.use("/signup", require("./routes/api/auth/signup"))
// Loging into application
app.use("/login", require("./routes/api/auth/login"))

// POSTS
// Internship posts
app.use("/posts", require('./routes/api/posts/post_internship'))

// USER HANDLERS
app.use('/user', require('./routes/api/handlers/user'))

// ENTERPRICE HANDLERS
app.use('/enterprice', require('./routes/api/handlers/enterprice'))



exports.api = functions.region("europe-west1").https.onRequest(app);