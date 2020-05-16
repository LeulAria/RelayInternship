const firebase = require('firebase')
const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
  firebase.auth().signOut();
  res.json({ message: 'signed out successfully!!!' })
})

module.exports = router;
