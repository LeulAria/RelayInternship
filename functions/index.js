const functions = require("firebase-functions")
const firebase = require("firebase")
const express = require("express")
const app = express();

// const { AuthUser, AuthEnterprice } = require('./utils/authGuard');

const { db } = require('./utils/admin');

const fbconfig = require("./utils/FBConfig")
firebase.initializeApp(fbconfig)

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Relay Internshps API",
      description: "RelayInternship try's to solve the problem of Most university/college students which they don’t have real-world work experience, university students usually struggle to find a good place to get a good internship position, the proposed platform is a solution to connect aspiring students with companies that are willing to take and train interns. Students can apply to as many companies on the platform, and the companies will choose the candidates that they desire",
      version: '0.0.1',
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/"
      },
    },
    servers: [
      {
        url: "https://europe-west1-relayinternships.cloudfunctions.net/api",
        // url: "http://localhost:5001/relayinternships/europe-west1/api",
      }
    ],
  },
  apis: ["index.js", "./routes/api/posts/*.js", "./routes/api/handlers/*.js", "./routes/api/auth/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));

/**
 * @swagger
 * tags:
 *  - name: Authentication
 *    description: authentication related routes
 *  - name: Internships
 *    description: internship posts related routes
 */
app.get("/", (req, res) => {
  res.send(
    `<h1 style="font-size:6vw;text-align:center;font-family:monospace;padding:6vw;
    box-shadow:0 0 10px 4px rgba(0,0,0,0.2);border-radius:2vw;margin:10%;">/RelayInternships API<p>/doc   to see the documentation</p><h1>`
  );
})

app.get("/g", /*AuthUserAuthEnterprice,*/ (req, res) => {
  console.log('some sheet here are things... ', req.user);
  console.log('handle:    ', req.handle);
  res.send('hugo...');
})


// AUTHENTICATIONS
// Signing into application
app.use("/signup", require("./routes/api/auth/signup"))
// Loging into application
app.use("/login", require("./routes/api/auth/login"))


// POSTS
// Internship posts
app.use("/posts", require('./routes/api/posts/posts'))


// USER HANDLERS
app.use('/user', require('./routes/api/handlers/user'))


// ENTERPRICE HANDLERS
app.use('/enterprice', require('./routes/api/handlers/enterprice'))

exports.api = functions.region("europe-west1").https.onRequest(app);