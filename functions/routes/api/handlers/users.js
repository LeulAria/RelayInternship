const os = require('os')
const fs = require('fs')
const path = require('path')
const express = require('express')
const router = express.Router();
const firebase = require('firebase')
const uuid = require('uuid')
const { db, admin } = require('../../../utils/admin')
const { AuthUser, AuthEnterprise }  = require('../../../utils/authGuard')
const fbConfig = require('../../../utils/FBConfig')

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
  if(req.params.id.includes('@rle-')) {
    db.doc(`/enterprises/${req.params.id}`).get()
    .then(doc => {
      res.json({ userInfo: doc.data(), isUser: true })
    })
    .catch((error) => res.status(404).json({ error: error.message }))
  } else if(req.params.id.includes('@rlu-')) {
    console.log('the user data... ')
    db.doc(`/users/${req.params.id}`).get()
    .then((doc) => {
      res.json({ userInfo: doc.data(), isCompany: true })
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
// delete account for enterprises
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

// send email verificatio to users to verify thei'r email
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
    res.send(403).json({ error: 'Unauthorized!' })
  }
})

// checking if the email is verified or not...
router.get('/is_verified', (req, res) => {
  const verified = firebase.auth().currentUser.emailVerified;
  res.json({ email_verified: verified })
})


// users uploading/updating their profile pic
router.post('/user/avatar', AuthUser, (req, res) => {
  const BusBoy = require('busboy');
  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png' && mimetype !== 'image/jpg') {
      return res.status(400).json({ error: 'Wrong file type submitted' });
    }

    // my.image.png => ['my', 'image', 'png']
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    // 32756238461724837.png
    imageFileName = `${uuid.v4()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on('finish', () => {
    admin
      .storage()
      .bucket(`${fbConfig.storageBucket}`)
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const avatarImg = `https://firebasestorage.googleapis.com/v0/b/${fbConfig.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.handle}`).update({ avatarImg });
      })
      .then(() => {
        return res.json({ message: 'image uploaded successfully' });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.message });
      });
  });
  busboy.end(req.rawBody);
})








// users uploading/updating their profile pic
router.post('/enterprise/avatar', AuthEnterprise, (req, res) => {

})

// users uploaing pdf version of their resume
router.post('/resume', AuthUser,  (req, res) => {

})

// sening viwable pdf file to the request
router.get(('/:id/resume', (req, res) => {

}))

module.exports = router