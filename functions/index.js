const functions = require("firebase-functions")
const firebase = require("firebase")
const express = require("express")
const cors = require('cors')({origin: true});
const app = express();

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

app.use(cors);
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
    `<div style="width:100vw;height:100vh;position:absolute;top:0;left:0;overflow:hidden;
    background:#111;color:#fff;display:flex;">
      <h1 style="margin: auto;font-family:ubuntu,monospace;font-weight:700;
      font-size:6vh;letter-spacing:2px;text-shadow:0 0 15px #fff7">RelayInternships API</h1>   
    </div>
    `
  );
})
      

// AUTHENTICATIONS
// Signing into application
app.use("/signup", require("./routes/api/auth/signup"))
// Loging into application
app.use("/login", require("./routes/api/auth/login"))
// Logging out of the application
app.use('/logout', require("./routes/api/auth/logout"))

// POSTS
// Internship posts
app.use("/posts", require('./routes/api/posts/posts'))

// USER HANDLERS
app.use('/users', require('./routes/api/handlers/users'))

exports.api = functions.region("europe-west1").https.onRequest(app);