const express = require('express');
const router = express.Router();
const { db } = require('../../../utils/admin');
const uuid = require("uuid");

router.get('/', (req, res) => {
  res.send('posts api').end();
});

// internship posts CRUD
// get all posted internships
router.get('/internships', (req, res) => {
  db.collection('internships').get()
  .then(snapshots => {
    const internships = [];
    snapshots.forEach((doc) => {
      internships.push(doc.data());
    })
    return res.json(internships);
  }).catch(err => {
    console.error('pppppp:   ', err);
    res.json(err);
  })
});

// get only one internship
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