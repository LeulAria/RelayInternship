const express = require('express');
const router = express.Router()
const { AuthUser } = require('../../../utils/authGuard')
const { db } = require('../../../utils/admin')


router.get('/', (req, res) => {
  db.collection('users').get()
  .then(snapshots => {
    const users = [];
    snapshots.forEach((doc) => {
      users.push(doc.data());
    })
    return res.json(users);
  }).catch(err => {
    res.json(err);
  })
})

// USER
// getting user details
router.get('/:uid', AuthUser, (req, res) => {
  db.doc(`/users/${req.params.uid}`).get()
  .then(user => {
    res.json(user.data())
  })
  .catch(err => res.json(err))
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
