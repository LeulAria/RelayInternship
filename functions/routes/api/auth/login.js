const express = require('express');
const routes = express.Router();

routes.get('/', (req, res) => {
  res.send('auth login api...')
})

routes.post('/login_user', (req, res) => {
  res.status(200).json({ msg: 'logged in as user', info: req.body });
})

routes.post('/login_enterprice', (req, res) => {
  res.status(200).json({ msg: 'logged in as enterprice', info: req.body });
})

module.exports = routes;