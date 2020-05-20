const express = require('express');
const router = express.Router();
const { db } = require('../../../utils/admin');
const uuid = require("uuid");
const { AuthEnterprise, AuthUser } = require('../../../utils/authGuard');

router.get('/', (req, res) => {
  res.send('posts api').end();
});


// internship posts CRUD
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
router.post('/internship', AuthEnterprise, (req, res) => {
  const newInternshipPost = {
    id: uuid.v4(),
    title: req.body.title,
    type: req.body.type,
    field_major: req.body.field_major,
    duration: req.body.duration,
    location:  req.body.location,
    number_of_candidates: req.body.number_of_candidates,
    enterprice_handle: req.handle,
    status: req.body.status,
    description: req.body.description,
    salary: req.body.salary,
    posted_at: new Date().toISOString(),
    expiredation: req.body.expiredation,
    applied_users: req.body.applied_users,
    accepted_users:  req.body.accepted_users,
    views: req.body.views,
    likes:  req.body.likes,
    commentCount: req.body.commentCount
  };

  db.doc(`/internships/${newInternshipPost.id}`).set(newInternshipPost)
  .then((doc) => {
    res.status(201).json({ msg: 'internship post created successfully', data: doc });
  })
  .catch(doc => {
    res.status(404).json({ msg:  })
  })
});


// update a posted internship
router.put('/internship/:id', AuthEnterprise, (req, res) => {
  db.doc(`/internship/${req.params.id}`).get()
  .then(doc => {
    const internshipPost = {
      ...doc.data()
    }
    return db.doc(`/internship${req.params.id}`).ref.update(req.body);
  }).then((doc) => {
    res.json({ message: 'document updated successfully!', doc })
  })
});


// delete a posted internship
router.delete('/internship/:id', AuthEnterprise, (req, res) => {
  db.doc(`/internships/${req.params.id}`).delete()
  .then((doc) => {
    res.json({ message: 'internship post delereted successfully!' });
  }).catch((err) => {
    res.json(err);
  })
});


router.get('/internship/:id/applied_users', AuthEnterprise, (req, res) => {
  db.doc(`/internships/${req.params.id}`).get()
  .then(doc => {
    let applied_users = doc.data().applied_users;
    res.json(applied_users)
  }).catch(err => res.json({ err }))
});


//USER ACTIONS ON POSTED INTERNSHIPS 
// like a posted internship
router.post('/internship/:id/like', AuthUser, (req, res) => {
  let internshipData, internshipId;
  console.log('like requested by: '+ req.params.id);
  db.doc(`/internships/${req.params.id}`)
  .get()
  .then(doc => {
    if(doc.exists) {
      internshipData = doc.data();
      internshipId = doc.id;
      console.log('getted the internships data: ', doc.data())
      return db
        .collection('likes')
        .where('userId', '==', req.handle)
        .where('internshipId', '==', req.params.id)
        .limit(1).get();
    } else {
      console.log('internships not found!')
      return res.status(404).json({ error: 'Internship Post not found!' });
    }
  })
  .then(data => {
    console.log('the like doc ', data)
    if(data.empty) {
      console.log('the like data exists')
      db.collection('likes')
      .add({
        userId: req.handle,
        internshipId: internshipId
      })
      .then(() => {
        console.log('added to db...')
        internshipData.likes++;
        return db.doc(`/internships/${req.params.id}`).update({ likes: internshipData.likes });
      })
      .then(() => {
        console.log(' the intern ship data after updated...')
        return res.json({ msg: 'Likes Sucessfully...' });
      });
      } else {
      console.log('internship already existd...')
      return res.status(400).json({ error: 'Internship Post already Liked...' });
    }
  })
});





// comment on a posted internship
router.post('/internship/:internship_id/comment', (req, res) => {
  req.json({ msg: 'in Development...' })
});

// applying on a posted internship
router.get('/internship/:internship_id/apply', AuthUser, (req, res) => {
  db.doc(`/internships/${req.params.internship_id}`).get()
  .then(doc => {
    let applied_users = Object.values(doc.data().applied_users);
    applied_users.forEach(user => {
      console.log(user)
    })
    if(applied_users.indexOf(req.handle) == -1) {
      applied_users.push(req.handle);
      const internshipPost = {
        ...doc.data(),
        applied_users: applied_users
      }
      db.doc(`/internships/${req.params.internship_id}`).ref().update(internshipPost);
      res.status(201).json({ message: 'Sucessfully Applied to the Internsihp...' })
    } else {
      res.send(400).json({ message: 'User Has Already Applied' });
    }
    // res.json(applied_users)
  }).catch(err => res.json({ err }))
});









module.exports = router;