const express = require('express');
const router = express.Router()

// USER
// getting user details
router.get('/:uid', (req, res) => {
  res.json({ msg: `return ${req.params.uid}user data here...` });
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


//ACTIONS ON POSTED INTERNSHIPS
// like a posted internship
router.post('/internship/:internship_id/like', (req, res) => {
  res.json({ msg: `you have liked a posted ${req.params.internship_id} internship`, info: req.body });
});

// comment on a posted internship
router.post('/internship/:internship_id/comment', (req, res) => {
  res.json({ msg: `you have commented on ${req.params.internship_id} internship`, info: req.body });
});

// applying on a posted internship
router.post('/internship/:internship_id/apply', (req, res) => {
  res.json({ msg: `applying for ${req.params.internship_id} internship`, info: req.body });
});


module.exports = router;
