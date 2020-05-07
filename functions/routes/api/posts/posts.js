const express = require('express');
const router = express.Router();
const { db } = require('../../../utils/admin');
const uuid = require("uuid");


router.get('/', (req, res) => {
  res.send('posts api').end();
});


// internship posts CRUD
// get all posted internships
/**
 * @swagger
 * /posts/internships:
 *  get:
 *    tags:
 *      - Internships
 *    description: get all internships data
 *    responses: 
 *      '200':
 *        description: return list of internships
 *        content:
 *          schema:
 *            $ref: '#/components/schemas/Internship'
 */
router.get('/internships', (req, res) => {
  db.collection('internships').get()
  .then(snapshots => {
    const internships = [];
    snapshots.forEach((doc) => {
      internships.push(doc.data());
    })
    return res.json(internships);
  }).catch(err => {
    res.json(err);
  })
});


// get only one internship

/**
* @swagger
* /posts/internship/{postedInternshipId}:
*   get:
*     tags:
*       - Internships
*     summary: Get one a single internshps post
*     description: get a single data of internshps
*     parameters:
*       - name: postedInternshipId
*         in: path
*         required: true
*         description: the id to query an internship post
*         schema:
*          type: string 
*     responses: 
*       '200':
*         description: Return a JSON object with the internshps datas
*         content:
*           application/json:
*             schema:
*               type: object 
*
* 
*   delete:
*    tags:
*      - Internships
*    summary: Delete Internship
*    description: deleting an existing internshp post as an enterprice
*    parameters:
*      - name: postedInternshipId
*        in: path
*        required: true
*        schema: 
*          type: string
*    responses:
*      '200':
*        description: internship post delereted successfully!
*
*/
router.get('/internship/:id', (req, res) => {
  db.doc(`/internships/${req.params.id}`).get()
  .then(snapshot => {
    if(snapshot.exists) {
      res.json(snapshot.data())
    } else {
      res.json({ error: "document doesn't exist" })
    }
  }).catch(err => {
    console.error(err);
    res.json(err);
  })
});


/**
 * @swagger
 * /posts/internship/:
 *   post:
 *     tags:
 *       - Internships
 *     summary: Post a new Internship
 *     description: post a new internship position as an enterprice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               title: 
 *                 type: string
 *               content: 
 *                 type: string
 *     responses:
 *       '201':
 *         description: Post created successfully
 */
// create a post internsip
router.post('/internship', (req, res) => {
  const newInternshipPost = {
    id: uuid.v4(),
    title: req.body.title,
    content: req.body.content
  };

  db.doc(`/internships/${newInternshipPost.id}`).set(newInternshipPost)
  .then((doc) => {
    res.status(201).json({ msg: 'internship post created successfully', data: doc });
  })
});


// update a posted internship
router.put('/internship/:id', (req, res) => {
  db.doc(`/internship/${req.params.id}`).get()
  .then(doc => {
    const updated = {
      title: req.body.title,
      content: req.body.content
    }
    return db.doc(`/internship${req.params.id}`).set(updatedInternshipPost);
  }).then((doc) => {
    res.json({ message: 'document updated successfully!', doc })
  })
  res.status(200).json({ msg: `internship ${req.params.id} post updated successfully!`, info: req.body });
});



// delete a posted internship
router.delete('/internship/:id', (req, res) => {
  db.doc(`/internships/${req.params.id}`).delete()
  .then((doc) => {
    res.json({ message: 'internship post delereted successfully!' });
  }).catch((err) => {
    res.json(err);
  })
});

module.exports = router;