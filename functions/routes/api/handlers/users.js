const express = require('express')
const router = express.Router();
const firebase = require('firebase')
const { db, admin } = require('../../../utils/admin')
const { AuthUser, AuthEnterprise }  = require('../../../utils/authGuard')

router.get('/', (req, res) => {
  const users = { users: [], enterprises: [] }
  db.collection('users').get()
  .then(snapshots => {
    if(!snapshots.empty)
      snapshots.forEach(doc => {
        users.users.push({
          fullname: doc.data().firstname+' '+doc.data().lastname,
          username: doc.data().handle,
          email: doc.data().email,
          avatarImg: doc.data().avatarImg
        })
      })
      return db.collection('enterprises').get()
  }).then(snapshots => {
    if(!snapshots.empty)
      console.log('some data on negotiating: ' + snapshots)
      snapshots.forEach(doc => {
        users.enterprises.push({
          enterprise_name: doc.data().enterprise_name,
          username: doc.data().handle,
          emai: doc.data().email,
          avatarImg: doc.data().avatarImg
        })
      })
    res.json(users)
  }).catch(err => {
    console.log(err)
    res.status(400).json({ message: 'Some thing went wrong', error: err.message })
  })
})

router.get('/user/:id', (req, res) => {
  let data;
  console.log(req.params.id)
  console.log('the output comparing it with @rlu-', req.params.id.includes('@rlu-') )
  console.log('the output comparing it with @rle-', req.params.id.includes('@rle-') )
  if(req.params.id.includes('@rle-')) {
    db.doc(`/enterprises/${req.params.id}`).get()
    .then(doc => {
      res.json(doc.data())
    })
    .catch((error) => res.status(404).json({ error: error.message }))
  } else if(req.params.id.includes('@rlu-')) {
    console.log('the user data... ')
    db.doc(`/users/${req.params.id}`).get()
    .then((doc) => {
      res.json(doc.data())
    })
    .catch((error) => res.status(404).json({ error: error.message }))
  } else {
    res.status(404).json({ error: 'user not found!' })
  }
})

// Update Account Details...
router.put('/user/:id', AuthUser, (req, res) => {
  db.doc(`/users/${req.handle}`).update(req)
  .then(() => {
    res.json({ message: 'Updates info sucessfully...' })
  })
  .catch((error) => {
    console.log(error)
    res.status(400).json({ message: 'Unable not update the data...', error })
  })
})

router.put('/enterprise/:id', AuthEnterprise, (req, res) => {
  db.doc(`/enterprises/${req.handle}`).updatae(req)
  .then(() => {
    res.json({ message: 'Updates info sucessfully...' })
  })
  .catch((error) => {
    console.log(error)
    res.status(400).json({ message: 'Unable to update the data...', error })
  })
})



// Delete Accounts
router.delete('/user', AuthUser, (req, res) => {
  var user = firebase.auth().currentUser;
  
  user.delete().then((doc) => {
    return db.doc(`/users/${req.handle}`).delete()
  })
  .then(() => {   
    res.json({ message: 'Accout deleted sucessfully!' })
  })
  .catch((error) => {
    res.status(400).json({ error: error })
  });
})

router.delete('/enterprise', AuthEnterprise, (req, res) => {
  var user = firebase.auth().currentUser;
  
  user.delete().then((doc) => {
    return db.doc(`/enterprises/${req.handle}`).delete()
  })
  .then(() => {   
    res.json({ message: 'Accout deleted sucessfully!' })
  })
  .catch((error) => {
    res.status(400).json({ error: error })
  });
})


router.post('/verify_email', (req, res) => {
  var user = firebase.auth().currentUser;
  
  if(user) {
    user.sendEmailVerification().then(() => {
      res.send(202).json({ message: 'Email has been sent' })
    }).catch((error) => {
      console.log(error)
      res.send(400).json({ error: error })
    });
  } else {
    res.send(400).json({ error: 'unauthorized... verification token...' })
  }
})

router.get('/is_verified', (req, res) => {
  const verified = firebase.auth().currentUser.emailVerified;
  res.json({ email_verified: verified })
})

module.exports = router