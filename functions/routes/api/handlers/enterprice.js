const express = require('express');
const router = express.Router();

// ENTERPRICE
// getting enterprice info
router.get('/:eid', (req, res) => {
  res.json({ msg: `here return ${req.params.id} enterprice id` })
})

router.put('/:eid/update_info', (req, res) => {
  res.json({ msg: `updating ${req.params.uid} enterprice info...`, info: req.body });
});

router.put('/:eid/update_avatar', (req, res) => {
  res.json({ msg: `updateing ${req.params.uid} enterprice avatar...`, info: req.body });
})

router.delete('/:eid/delete_accout', (req, res) => {
  res.json({ msg: `deleting ${req.params.uid} enterprice`, info: req.body });
})


//INTERNSHIP ENTERPRICE ADMIN
router.get('/internship/:internship_id/get_applied_users', (req, res) => {
  res.json({ msg: `here return ${req.params.id} internship and users applide to this specifi position` });
})

router.post('/internship/:internship_id/accept_user/:uid', (req, res) => {
  res.json({ msg: `accepting ${req.params.uid} for position ${req.params.internship_id}internship` });
})

module.exports = router