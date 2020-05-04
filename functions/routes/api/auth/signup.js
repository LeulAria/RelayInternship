const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('auth signup api...');
})

router.get('/signup_user', (req, res) => {
  res.status(201).json({ route: 'signup as users', info: req.body })
});

router.get('/signup_enterprice', (req, res) => {
  res.status(201).json({ route: 'signup as enterprice', info: req.body })
});

module.exports = router