const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('posts api').end();
});

// internship posts CRUD
// get all posted internships
router.get('/internships', (req, res) => {
  res.json({ data: { msg: 'return all internships posted data here...' } });
});

// get only one internship
router.get('/internship/:id', (req, res) => {
  res.json({ data: { msg: 'return one posted internship' } });
})

// create a post internsip
router.post('/internship', (req, res) => {
  res.status(201).json({ msg: 'internship post created successfully', info: req.body });
});

// update a posted internship
router.put('/internship/:id', (req, res) => {
  res.status(200).json({ msg: `internship ${req.params.id} post updated successfully!`, info: req.body });
});

// delete a posted internship
router.delete('/internship/:id', (req, res) => {
  res.status(200).json({ msg: `internship ${req.params.id} post deleted successfully!`, info: req.body });
});


module.exports = router;