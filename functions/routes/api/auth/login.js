const firebase = require('firebase');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('auth login api...')
})

router.post('/', (req, res) => {
  const loginData = {
    email: req.body.email,
    password: req.body.password
  }

  firebase.auth()
  .signInWithEmailAndPassword(loginData.email, loginData.password)
  .then(credentials => credentials.user.getIdToken())
  .then(token => res.json({ token }))
  .catch((err) => {
    console.log(err)
    res.status(400).json(err);
  });
})

module.exports = router;