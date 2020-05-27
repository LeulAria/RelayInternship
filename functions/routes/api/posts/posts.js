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
      res.json({ error: "Document doesn't exist" })
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
    applied_users: [],
    accepted_users: [],
    views: 0,
    likes:  0,
    commentCount: 0
  };

  db.doc(`/internships/${newInternshipPost.id}`).set(newInternshipPost)
  .then((doc) => {
    db.doc(`/internships/${newInternshipPost.id}`).get().then((doc) => {
      res.status(201).json({ msg: 'Internship post created successfully', internshipData: doc.data() });
    }).catch((error) => {
      res.status(400).json({ msg: 'Internship data was created but was unable to fetch it...' })
    })
  })
  .catch(error => {
    res.status(404).json({ msg: 'Erorr Occured while trying to post...' })
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
    res.json({ message: 'Document updated successfully!', doc })
  })
});


// delete a posted internship
router.delete('/internship/:id', AuthEnterprise, (req, res) => {
  db.doc(`/internships/${req.params.id}`).get()
  .then((doc) => {
    if(doc.exists) {
      if(doc.data().enterprice_handle == req.handle) {
        return db.doc(`/internships/${req.params.id}`).delete()
      } else {
        res.status(403).json({ error: 'This enterprise is Unauthorized to delete this post!' })
      }
    } else {
      res.status(400).json({ error: 'Internship post not found!' });
    }
  })
  .then(() => {
    res.status(200).json({ message: 'Internship post deleted successfully!' });
  })
  .catch((err) => {
    res.status(404).json({ error: err.message });
  })
});


router.get('/internship/:id/applied_users', AuthEnterprise, (req, res) => {
  db.doc(`/internships/${req.params.id}`).get()
  .then((doc) => {
    if(doc.exists) {
      if(doc.data().enterprice_handle == req.handle) {
        return db.doc(`/internships/${req.params.id}`).get()
      } else {
        res.status(403).json({ error: 'This enterprise is Unauthorized to see this post!' })
      }
    } else {
      res.status(400).json({ error: 'Internship post not found!' });
    }
  })
  .then((doc) => {
    let applied_users = doc.data().applied_users;
    res.json(applied_users)  
  })
  .catch((err) => {
    res.status(404).json({ error: err.message });
  })
});

router.get('/internship/:id/accepted_users', AuthEnterprise, (req, res) => {
  db.doc(`/internships/${req.params.id}`).get()
  .then((doc) => {
    if(doc.exists) {
      if(doc.data().enterprice_handle == req.handle) {
        return db.doc(`/internships/${req.params.id}`).get()
      } else {
        res.status(403).json({ error: 'This enterprise is Unauthorized to see this post!' })
      }
    } else {
      res.status(400).json({ error: 'Internship post not found!' });
    }
  })
  .then((doc) => {
    let accepted_users = doc.data().accepted_users;
    res.json(accepted_users)
  })
  .catch((err) => {
    res.status(404).json({ error: err.message });
  })
});


router.post('/internship/:internship_id/accept/:uid', AuthEnterprise, (req, res) => {
  let internshipData, internshipId;
  const username = req.params.uid;
  db.doc(`/internships/${req.params.internship_id}`)
  .get()
  .then(doc => {
    if(doc.exists) {
      if(doc.data().enterprice_handle == req.handle) {
        internshipData = doc.data();
        internshipId = doc.id;
        const applied_users = internshipData.applied_users 
        const accepted_users = internshipData.accepted_users

        const user = applied_users.filter(user => user.username == username)[0]
        const userfound = accepted_users.some(e => e.username == user.username)
        if(!userfound) {
          accepted_users.push(user);
          const internshipPost = {
            ...internshipData,
            accepted_users: accepted_users
          }
          db.doc(`/internships/${req.params.internship_id}`).update(internshipPost)
          .then(() => {
            res.status(201).json({ message: `${user.fullname} has been Sucesfully accepted!` })
          }).catch((error) => {
            res.status(400).json({ error: error.message })
          })
        }else {
          res.json({ message: 'User has been already accepted' })
        }
      }
      else {
        res.json({ error: 'This enterprice is unauthorized for this internship post actions!' })
      }
    } else {
      return res.status(404).json({ error: 'Internship Post not found!' });
    }
  })
  .catch((error) => {
    res.status(400).json({ error })
  })
})


router.get('/internship/:id/comments', (req, res) => {
  db.doc(`/internships/${req.params.id}`).get()
  .then((doc) => {
    if(doc.exists) {
      return db.collection('comments').where('internshipId', '==', req.params.id).get()
    } else {
      res.status(404).json({ error: 'Internship Post Not Foud!' })
    }
  })
  .then((docs) => {
    const comments = docs.docs.map(doc => doc.data())
    console.log(comments);
    res.json({ comments })
  })
  .catch((err) => res.status(400).json({ error: err.message }))
})


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
        return res.json({ msg: 'Liked Sucessfully...' });
      });
    } else {
      return res.status(400).json({ error: 'Internship Post already Liked...' });
    }
  })
});


// comment on a posted internship
router.post('/internship/:id/comment', AuthUser, (req, res) => {
  const newComment = {
    internshipId: req.params.id,
    userId: req.handle,
    comment: req.body.comment,
    created_at: new Date().toISOString() 
  }

  let internship;
  db.doc(`/internships/${req.params.id}`).get()
  .then(doc => {
    if(doc.exists) {
      internship = doc.data()
      return db.collection('comments').where('internshipId', '==', newComment.internshipId)
      .where('userId', '==', newComment.userId).limit(1).get()
    } else {
      res.status(404).json({ error: 'Internship not found!' });
    }
  })
  .then((doc) => {
    if(!doc.exists) {
      console.log('you haven\'t commened')
      console.log('adding to data base th comments...')
      return db.collection('comments').add(newComment);
    } else {
      console.log('you have commented: ', doc.data())
      res.status(400).json({ message: 'You have commented Already' })
    }
  })
  .then(() => {
    console.log('the comment added successfully')
    return db.doc(`/internships/${req.params.id}`).update({ commentCount: ++internship.commentCount })
  })
  .then(() => {
    res.status(201).json({ message: 'The Comment has been saved sucessfully!' });
  })
  .catch((err) => res.status(400).json({ error: err.message }))
});

// applying on a posted internship
router.post('/internship/:internship_id/apply', AuthUser, (req, res) => {
  db.doc(`/internships/${req.params.internship_id}`).get()
  .then(doc => {
    let internshipData = doc.data();
    let applied_users = doc.data().applied_users;
    console.log('applied users: ', applied_users)
    const found = applied_users.some(el => el.username === req.handle);

    if(!found) {
      db.doc(`/users/${req.handle}`).get().then(doc => {
        const user = {
          username: doc.data().handle,
          fullname: doc.data().firstname+' '+doc.data().lastname,
          email: doc.data().email,
          avatarImg: doc.data().avatarImg
        }
        applied_users.push(user);
        const internshipPost = {
          ...internshipData,
          applied_users: applied_users
        }
        db.doc(`/internships/${req.params.internship_id}`).update(internshipPost)
        .then(() => {
          res.status(201).json({ message: 'Sucessfully Applied to the Internsihp...' })
        }).catch((error) => {
          res.status(400).json({ error: error.message })
        }) 
      })
      .catch((error) => res.status(400).json({ error: error.message }))
    } else {
      res.send(400).json({ message: 'User Has Already Applied' });
    }

  }).catch(error => res.status(404).json({ error: error.message }))
});

module.exports = router;