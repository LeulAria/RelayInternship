const firebase = require('firebase')
const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
  firebase.auth().signOut().then(() => {
    res.json({ message: 'signed out successfully!!!' })
  }).catch(error => res.status(400).json({ error: error.message }))
})

module.exports = router;
