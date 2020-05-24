const { admin, db } = require('./admin')

module.exports.AuthUser = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  admin.auth()
  .verifyIdToken(idToken)
  .then((decodedToken) => {
    req.user = decodedToken;
    if(req.user.userType == 'user')
      return db.collection('users').where('userId', '==', req.user.uid).limit(1).get();
    else
      return res.json({ error: 'auth forbidden for enterprises... only users can request...' });
  }).then(data => {
    req.handle = data.docs[0].data().handle
    return next();
  }).catch(error => res.json({ error: error.message }))
}

module.exports.AuthEnterprise = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  admin.auth()
  .verifyIdToken(idToken)
  .then((decodedToken) => {
    req.user = decodedToken;
    if(req.user.userType == 'enterprise')
      return db.collection('enterprises').where('enterpriseId', '==', req.user.uid).limit(1).get()
    else
      return res.json({ error: 'auth forbidden for users... only enterprises can request...' });
  }).then(data => {
    req.handle = data.docs[0].data().handle
    return next();
  }).catch(error => res.json({ error: error.message }))
}