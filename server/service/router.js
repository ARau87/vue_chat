const path = require('path');

module.exports = (app) => {

  // INDEX PAGE
  app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + '/../../client/pages/index.html'));
  });

  // LOGIN PAGE
  app.get('/logout', (req,res) => {
    req.session = null;
    res.redirect('/');
  });

  // LOGIN PAGE
  app.get('/login', (req,res) => {
    res.sendFile(path.join(__dirname + '/../../client/pages/login.html'));
  });

  // REGISTER PAGE
  app.get('/register', (req,res) => {
    res.sendFile(path.join(__dirname + '/../../client/pages/register.html'));
  });

  // LOBBY PAGE
  app.get('/lobby', (req, res) => {
    if(req.session.user && req.session.password){
      res.sendFile(path.join(__dirname + '/../../client/pages/lobby.html'));
    }
    else {
      res.redirect('/login');
    }
  });

  // CHAT PAGE
  app.get('/chat/:chatName', (req, res) => {
    if(req.session.user && req.session.password){
      res.sendFile(path.join(__dirname + '/../../client/pages/chat.html'));
    }
    else {
      res.redirect('/login');
    }
  })

}
