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

  const newUser = {
    // userId: fb-assigned...
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
    gender: req.body.gender,
    dob: req.body.dob,
    eduction: req.body.eduction,
    major: req.body.major,
    nationality: req.body.nationality,
    // social_media_accounts: 'string/link', optional
    address: req.body.address,
    current_work: req.body.current_work,
    experince: req.body.experince,
    createdAt: new Date().toISOString(),
    bio: req.body.bio,
    avatarImg: `https://firebasestorage.googleapis.com/v0/b/${FBconfig.storageBucket}/o/${defaultAvatar}?alt=media`,
  };

  let token, userId;
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
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((credentials) => {
      userId = credentials.user.uid;
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
      res.status(201).json({ token });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: error });
    });
});

router.post("/signup_enterprise", (req, res) => {
  const defaultAvatar = "enterprice-default-avatar.png";

  const newEnterprise = {
    enterprise_name: req.body.enterprise_name,
    email: req.body.email,
    password: req.body.password,
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

  let token, enterpriseId;
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
          .createUserWithEmailAndPassword(newEnterprise.email, newEnterprise.password);
      }
    })
    .then((credentials) => {
      enterpriseId = credentials.user.uid;
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
      return db.doc(`/enterprise/${newEnterprise.handle}`).set(newEnterprise);
    })
    .then(() => {
      res.status(201).json({ token });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: error });
    });
});

module.exports = router;
