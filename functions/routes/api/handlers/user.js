const express = require('express');
const router = express.Router()
const { AuthUser } = require('../../../utils/authGuard')
const { db } = require('../../../utils/admin')

// USER
// getting user details
router.get('/:uid', (req, res) => {
  db.collection('users').get()
  .then(doc => {
    console.log(doc)
  })
});

router.put('/:uid/updateInfo', (req, res) => {
  res.json({ msg: `updating ${req.params.uid} user info...`, info: req.body });
});

router.put('/:uid/updateAvatar', (req, res) => {
  res.json({ msg: `updateing ${req.params.uid} user avatar...`, info: req.body });
})

router.delete('/:uid/deleteAccout', (req, res) => {
  res.json({ msg: `deleting ${req.params.uid} user`, info: req.body });
})


module.exports = router;
