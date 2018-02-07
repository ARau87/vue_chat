const path = require('path');
const database = require('./database');
const validate = require('./validate');
const socket = require('./socket');

module.exports = (app,io) => {

  // CHAT RELATED ENDPOINTS

  app.get('/api/chats', (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    if(req.session.user){
      database.getAllChats()
              .then((chats) => {
                res.status(200).send({chats: chats, code: 200});
              })
              .catch(err => {
                res.status(500).send({message: 'Internal server error', code: 500});
              });
    }
    else {
      res.status(401).send({body: 'Forbidden Request', code: 401});
    }
  });

  app.post('/api/chat/create', (req,res) => {
    console.log('[SERVER] New chat created: ', req.body);
    res.setHeader('Content-Type', 'application/json');
    if(req.session.user){
      database.createNewChat(req.body.name)
              .then((chat) => {
                if(chat){
                  res.status(200).send({message: 'Chat created successfully' , code: 200});
                  socket.newChat(io, chat.name);
                }
                else {
                  res.status(400).send({message: 'Chat already exists' , code: 400});
                }
              })
              .catch(err => {
                console.log('[SERVER] Error:', err);
                res.status(500).send({message: 'Internal server error', code: 500});
              });
    }
    else {
      res.status(401).send({body: 'Forbidden Request', code: 401});
    }
  });

  app.get('/api/chat/:name', (req,res) => {
    if(req.session.user){
      database.findChat(req.params.name)
              .then((chat) => {
                if(chat){
                  res.status(200).send({chat: chat, code: 200});
                }
                else {
                  res.status(400).send({message: 'Chat information could not be loaded!', code: 400});
                }
              })
              .catch(err => {
                res.status(500).send({message: 'Internal server error', code: 500});
              })
    }
    else {
      res.status(401).send({message: 'Forbidden please login ', code: 401});
    }
  });

  app.get('/api/chat/:name/users', (req,res) => {
    if(req.session.user){
      database.findChat(req.params.name)
              .then((chat) => {
                if(chat){
                  console.log('[SERVER] Users of chat requested. Found: ', chat.users);
                  res.status(200).send({users: chat.users, code: 200});
                }
                else {
                  res.status(400).send({message: 'Chat information could not be loaded!', code: 400});
                }
              })
              .catch(err => {
                console.log(err);
                res.status(500).send({message: 'Internal server error', code: 500});
              })
    }
    else {
      res.status(401).send({message: 'Forbidden please login ', code: 401});
    }
  });

};
