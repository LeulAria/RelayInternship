const { admin, db } = require('./admin')

module.exports.AuthUser = (req, res, next) => {
  let idtoken = null;
  if(req.headers.authorization) {
    idtoken = req.headers.authorization;
  } else {
    res.status(404).json({ error: 'Unauthorized!' });
  }

  admin.auth()
  .verifyIdToken(idtoken)
  .then((decodedToken) => {
    req.user = decodedToken;
    if(req.user.userType == 'user')
      return db.collection('users').where('userId', '==', req.user.uid).limit(1).get();
    else
      return res.json({ error: 'auth forbidden for enterprises... only users can request...' });
  }).then(data => {
    req.handle = data.docs[0].data().handle
    return next();
  }).catch(error => res.json(error))
}

module.exports.AuthEnterprise = (req, res, next) => {
  let idtoken = null;
  if(req.headers.authorization) {
    idtoken = req.headers.authorization;
  } else {
    res.status(404).json({ error: 'Unauthorized!' });
  }

  admin.auth()
  .verifyIdToken(idtoken)
  .then((decodedToken) => {
    req.user = decodedToken;
    if(req.user.userType == 'enterprise')
      return db.collection('enterprise').where('enterpriseId', '==', req.user.uid).limit(1).get()
    else
      return res.json({ error: 'auth forbidden for users... only enterprises can request...' });
  }).then(data => {
    req.handle = data.docs[0].data().handle
    return next();
  }).catch(error => res.json('Some thing went wrong!!!'))
}