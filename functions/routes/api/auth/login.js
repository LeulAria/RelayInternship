const firebase = require('firebase');
const express = require('express');
const router = express.Router();
const { db } = require('../../../utils/admin')

router.get('/', (req, res) => {
  res.send('auth login api...')
})

/**
 * @swagger
 * /login/:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: login to the platfrom
 *    description: login as user or enterprice
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema: 
 *            type: object
 *            properties:
 *              email: 
 *                type: string
 *                example: jhon@gmail.com
 *              password: 
 *                type: string
 *    responses:
 *      "200":
 *        description: Return token
 *      "400":
 *        description: bad request
 *
 */
router.post('/', (req, res) => {
  const loginData = {
    email: req.body.email,
    password: req.body.password
  }

  let token, user, userInfo;
  firebase.auth()
  .signInWithEmailAndPassword(loginData.email, loginData.password)
  .then(credentials => {
    user = credentials.user;
    return credentials.user.getIdToken()
  })
  .then(idtoken => {
    token = idtoken;
    if(user.displayName.includes('@rlu-')) {
      console.log('it is a user-----------')
      return db.doc(`/users/${user.displayName}`).get()
    }
    else if(user.displayName.includes('@rle-')) {
      return db.doc(`/enterprises/${user.displayName}`).get()
    }
    else {
      res.json({ errro: 'Unknown Username...' })
    }
  })
  .then((user) => {
    console.log('user found...', user.data())
    user = user.data()
    fullname = (user.firstname) ? user.firstname+' '+user.lastname : null
    userInfo = {
      username: user.handle,
      fullname: fullname || user.enterprise_name,
      email:  user.email,
      avatarImg: user.avatarImg
    }
    res.json({ token, userInfo })
  })
  .catch((err) => {
    console.log(err)
    res.status(404).json({ error:'user not found...' });
  });
})

module.exports = router;