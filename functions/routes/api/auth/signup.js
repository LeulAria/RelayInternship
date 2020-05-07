const firebase = require('firebase')
const { admin, db } = require('../../../utils/admin');
const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
  res.send('auth signup api...');
});


/**
*@swagger 
* /signup/signup_user:
*  post:
*    tags: 
*      - Authentication
*    summary: Signup as user
*    description: signing up a new user to the platform
*    requestBody:
*      required: true
*      content:
*        application/json:
*          schema:
*            type: object
*            properties:
*              email:
*                type: string
*                example: jhon@yahoo.com
*              password:
*                type: string
*              handle:
*                type: string
*                example: jhon123
*    responses: 
*      "201":
*        description: Return Token
*      "400":
*        description: bad request
*/
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




/**
 *@swagger
 * /signup/signup_enterprice:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Signup as enterprice
 *    description: singin up as a new enterprice to the platform
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema: 
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: apple@apple.inc
 *              password:
 *                type: string
 *              handle: 
 *                type: string
 *                example: apple
 *    responses:
 *      '201':
 *        description: Return token
 *      '400':
 *        description: bad request
 */
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