const express = require('express');
const path = require('path');
const keys = require('../config/keys');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

module.exports = (app) => {

  app.use('/resources',express.static(path.join(__dirname + '../../../client/resources')));
  app.use(bodyParser.json());
  app.use(cookieParser(keys.cookieKey));
  app.use(
    cookieSession({
      name: 'session',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [keys.cookieKey]
    })

  );
  app.use((req,res,next) => {
    if(req.session && req.sessionOptions.maxAge === req.session.maxAge){
      database.setUserLoggedOut(req.session.user);
    }
    next();
  });

}
