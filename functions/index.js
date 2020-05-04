const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send(`<h1 style="position:absolute;top:25%;left:50%;transform:translate(-50%,-50%);font-size:8vw;letter-spacing: 1vw;color:#444;font-weight: 200;font-family: monospace;"><small>Relay-Internships API</small></h1>`);
});
