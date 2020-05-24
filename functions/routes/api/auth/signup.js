const firebase = require("firebase");
const { admin, db } = require("../../../utils/admin");
const FBconfig = require("../../../utils/FBConfig");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("auth signup api...");
});

router.post("/signup_user", (req, res) => {
  const defaultAvatar = "defaut_avatar.png";

  if(!req.body.handle.includes('@rlu-')) {
    res.status(400).json({ error: 'WTF Pease use @rlu- in front of usernames/handles for users...' })
  }

  if(req.body.password !== req.body.confirmPassword) {
    res.status(400).json({ error: 'Password must match...' })
  }

  const newUser = {
    // userId: fb-assigned...
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    handle: req.body.handle,
    gender: req.body.gender,
    dob: req.body.dob,
    eduction: req.body.eduction,
    major: req.body.major,
    nationality: req.body.nationality,
    address: req.body.address,
    current_work: req.body.current_work,
    experince: req.body.experince,
    createdAt: new Date().toISOString(),
    bio: req.body.bio,
    avatarImg: `https://firebasestorage.googleapis.com/v0/b/${FBconfig.storageBucket}/o/${defaultAvatar}?alt=media`,
  };

  let token, userId, user;
  db.doc(`/users/${newUser.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ error: "this username is already taken!!!" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, req.body.password);
      }
    })
    .then((credentials) => {
      userId = credentials.user.uid;
      user = credentials.user;
      return credentials.user.getIdToken();
    })
    .then((credToken) => {
      token = credToken;
      newUser.userId = userId;
      return admin.auth().setCustomUserClaims(userId, {
        userType: "user",
      });
    })
    .then(() => {
      return db.doc(`/users/${newUser.handle}`).set(newUser);
    })
    .then(() => {
      return user.updateProfile({
        displayName: newUser.handle
      })
    })
    .then(() => {
      res.status(201).json({ 
        token,
        userInfo: {
          fullname: newUser.firstname+' '+newUser.lastname,
          username: newUser.handle,
          email: newUser.email,
          avatarImg: newUser.avatarImg
        }
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: error.message });
    });
});

router.post("/signup_enterprise", (req, res) => {
  const defaultAvatar = "enterprice-default-avatar.png";

  if(!req.body.handle.includes('@rle-')) {
    res.status(400).json({ error: 'Pease use @rle- symbols in front of usernames/handles for enterprises...' })
  }

  if(req.body.password !== req.body.confirmPassword) {
    res.status(400).json({ error: 'Password must match...' })
  }

  const newEnterprise = {
    enterprise_name: req.body.enterprise_name,
    email: req.body.email,
    handle: req.body.handle,
    enterprise_type: req.body.enterprise_type,
    address: req.body.address,
    social_link: req.body.social_link,
    enterprise_size: req.body.enterprise_size,
    website: req.body.website,
    createdAt: new Date().toISOString(),
    enterprise_startedDate: req.body.enterprise_startedDate,
    description: req.body.description,
    avatarImg: `https://firebasestorage.googleapis.com/v0/b/${FBconfig.storageBucket}/o/${defaultAvatar}?alt=media`,
  };

  let token, enterpriseId, enterprise;
  db.doc(`/enterprises/${newEnterprise.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ error: "this enterprice name is already taken!!!" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(
            newEnterprise.email,
            req.body.password
          );
      }
    })
    .then((credentials) => {
      enterpriseId = credentials.user.uid;
      enterprise = credentials.user;
      return credentials.user.getIdToken();
    })
    .then((credToken) => {
      token = credToken;
      newEnterprise.enterpriseId = enterpriseId;
      return admin.auth().setCustomUserClaims(enterpriseId, {
        userType: "enterprise",
      });
    })
    .then(() => {
      return db.doc(`/enterprises/${newEnterprise.handle}`).set(newEnterprise);
    })
    .then(() => {
      return enterprise.updateProfile({
        displayName: newEnterprise.handle
      })
    })
    .then(() => {
      res.status(201).json({
        token,
        userInfo: {
          fullname: newEnterprise.enterprise_name,
          username: newEnterprise.handle,
          email: newEnterprise.email,
          avatarImg: newEnterprise.avatarImg
        }
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: error.message });
    });
});

module.exports = router;
