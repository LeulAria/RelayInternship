const firebase = require('firebase');
const express = require('express');
const router = express.Router();

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

  firebase.auth()
  .signInWithEmailAndPassword(loginData.email, loginData.password)
  .then(credentials => credentials.user.getIdToken())
  .then(token => res.json({ token }))
  .catch((err) => {
    console.log(err)
    res.status(400).json(err);
  });
})

module.exports = router;