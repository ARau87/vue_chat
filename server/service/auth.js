const path = require('path');
const database = require('./database');
const validate = require('./validate');

module.exports = (app) => {

  app.post('/auth/logout', (req,res) => {
    database.setUserLoggedOut(req.session.user)
            .then(() => {
              req.session = null;
              res.status(200).send({body: 'Logout successful', code: 200});
            })
            .catch(err => res.status(500).send({body: 'Internal server error', code: 500}))
  });

  // LOGIN ROUTE
  app.post('/auth/login', (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    console.log('[SERVER] Login Request: ',req.body);
    console.log('[SERVER] Session: ',req.session.user);
    if(req.body.username && req.body.password){
      database.findUser(req.body.username, req.body.password)
              .then((found) => {
                console.log(found);
                if(found && found.isLoggedIn === false){
                  database.setUserLoggedIn(found.username)
                          .then(() => {
                            req.session = {user: req.body.username, password: req.body.password};
                            res.status(200).send({body: 'Login successful', code: 200});
                          })
                          .catch(err => res.status(500).send({body: 'Internal server error', code: 500}));
                }
                else if(found && found.isLoggedIn === true){
                  res.status(400).send({body: 'Your are already logged in on this or another computer! Please logout before you login again.', code: 400});
                }
                else {
                  res.status(400).send({body: 'Login failed. Please try again!', code: 400});
                }
              })
              .catch(err => res.status(500).send({body: 'Internal server error', code: 500}));
    }
    else res.status(400).send({body: 'Bad request!', code: 400});

  });

  // REGISTER ROUTE
  app.post('/auth/register', (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    console.log('[SERVER] Register Request: ',req.body);
    if(validate.registration(req.body)){
      if(req.body.username && req.body.password && req.body.nickname && req.body.access_key){
        database.createNewUser(req.body.username, req.body.password, req.body.nickname, req.body.access_key)
                .then((user) => {
                  if(user){
                    res.status(200).json({body: 'User created successfully!', code: 200});
                  }
                  else {
                    res.status(400).json({body:'Error occured while creating user!', code: 400});
                  }
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json({body:'Internal server error', code: 400});
                });
      }
      else {
        res.status(400).json({body:'Bad request!', code: 400});
      }
    }
    else {
      res.status(400).json({body:'Validation error!', code: 400});
    }
  });

  // USER ENDPOINT
  app.get('/auth/me', (req,res) => {
    if(req.session.user){
      database.getUser(req.session.user)
              .then((user) => {
                if(user){
                  res.status(200).json({user: user, code: 200});
                }
                else {
                  res.status(400).json({message: 'User not found', code: 400});
                }
              })
              .catch(err => {
                res.status(500).json({message: 'Internal server error', code: 500});
              });
    }
    else {
      res.status(401).json({message: 'Forbidden. Please login!', code: 401});
    }
  });

}
