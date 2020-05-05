const firebase = require('firebase')
const { admin, db } = require('../../../utils/admin');
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('auth signup api...');
});


router.post('/signup_user', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    handle: req.body.handle
  }

  let token, userId;
  db.doc(`/users/${newUser.handle}`).get()
  .then(doc => {
    if(doc.exists) {
      return res.status(400).json({ error: 'the username is already taken!!!' })
    } else {
      return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
    }
  }).then(credentials => {
    userId = credentials.user.uid;
    return credentials.user.getIdToken();
  }).then(credtoken => {
    token = credtoken;
    const userCredentials = {
      userId,
      email: newUser.email,
      createdAt: new Date().toISOString(),
      handle: newUser.handle
    }
    return db.doc(`/users/${newUser.handle}`).set(userCredentials);
  }).then(() => {
    res.status(201).send({ token });
  }).catch(err =>{
    res.status(400).json(err);
  });
});

router.post('/signup_enterprice', (req, res) => {
  const newEnterprice = {
    email: req.body.email,
    password: req.body.password,
    handle: req.body.handle 
  }

  let token, enterpriceId;
  db.doc(`/enterprices/${req.body.enterprice_name}`).get()
  .then(doc => {
    if(doc.exists) {
      res.status(400).json({ error: 'this enterprice name is not available' });
    } else {
      return firebase.auth().createUserWithEmailAndPassword(newEnterprice.email, newEnterprice.password)
    }
  }).then((credentials) => {
    enterpriceId = credentials.user.uid;
    return credentials.user.getIdToken();
  }).then(credToken => {
    token = credToken;
    const enterpriceCredentials = {
      enterpriceId,
      email: newEnterprice.email,
      createAt: new Date().toISOString(),
      handle: newEnterprice.handle
    }
    return db.doc(`/enterprices/${newEnterprice.handle}`).set(enterpriceCredentials);
  }).then((doc) => {
    res.status(201).json({ token });
  }).catch((err) => {
    console.log(err);
    res.status(400).json(err);
  })
});

module.exports = router