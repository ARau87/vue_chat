const mongoose = require('mongoose');
const keys = require('../config/keys');

const findKey = async (access_key) => {
  let Key = mongoose.model('keys');

  let key = await Key.findOne({key: access_key});

  if(key){
    return true;
  }
  else {
    return false;
  }
}

module.exports = {

  // USER RELATED DATABASE INTERACTIONS
  setup: () => {

    mongoose.Promise = global.Promise;
    mongoose.connect(keys.mongoURI);

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error: '))

    //SCHEMATA HERE
    require('../models/user');
    require('../models/chat');
    require('../models/access_key');
  },
  createNewUser: async (username, password, nickname, access_key) => {
    const User = mongoose.model('users');

    let key = await findKey(access_key);

    if(key){
      if(!(await User.findOne({username: username}))){
        return new User({username: username, password: password, nickname: nickname, image: '', created: Date.now()}).save();
      }
      else {
        return null;
      }
    }
    else {
      return null;
    }
  },
  findUser: async (username, password) => {
    const User = mongoose.model('users');

    let user = await User.findOne({username: username, password:password});

    if(user){
      return user;
    }
    else {
      return null;
    }
  },
  getUser: async (username) => {
    const User = mongoose.model('users');

    return User.findOne({username});
  },

  setUserLoggedIn: async (username) => {
    const User = mongoose.model('users');

    return User.where({username: username})
               .updateOne({$set: {isLoggedIn: true}})
               .exec();
  },

  setUserLoggedOut: async (username) => {
    const User = mongoose.model('users');

    return User.where({username: username})
               .updateOne({$set: {isLoggedIn: false}})
               .exec();
  },

  // CHATS RELATED INTERACTIONS
  getAllChats: async () => {
    const Chat = mongoose.model('chats');

    let chats = await Chat.find({});

    return chats;
  },

  createNewChat: async (name) => {
    const Chat = mongoose.model('chats');


    if(!(await Chat.findOne({name: name}))){
      return new Chat({name: name, num_of_users: 0, users: [], created: Date.now()}).save();
    }
    else {
      return null;
    }
  },

  findChat: async (name) => {
    const Chat = mongoose.model('chats');

    let chat = await Chat.findOne({name: name});

    if(chat){
      return chat;
    }
    else {
      return null;
    }
  },

  addChatUser: async(chatname, username) => {
    const Chat = mongoose.model('chats');
    const User = mongoose.model('users');

    let user = await User.findOne({username: username});
    let chat = await Chat.findOne({name: chatname});

    if(user && chat){
      console.log('[DATABASE] User and Chat found! Progress to updating chat!');
      let chatUsers = chat.users;

      //Check if user is already in chat. If so do nothing.
      if(!chatUsers.find((arrUser) => arrUser.username === user.username)){
        chatUsers.push({username: user.username, nickname: user.nickname});
        return Chat.where({name: chatname})
                   .updateOne({$set: {users: chatUsers}})
                   .exec();
      }
      else {
        return null;
      }

    }
    else {
      return null;
    }
  },
  deleteChatUser: async (chatname, username) => {
    const Chat = mongoose.model('chats');

    let chat = await Chat.findOne({name: chatname});
    let chatUsers = chat.users;

    if(chat){
      let i = chatUsers.findIndex((arrUser) => arrUser.username == username);
      if(i > -1){
        chatUsers.splice(i,1);
        return Chat.where({name: chatname})
                   .setOptions({overwrite: true})
                   .updateOne({$set: {users: chatUsers}})
                   .exec();
      }
      else {
        return null;
      }
    }
    else {
      return null;
    }
  },

  // ACCESS KEY RELATED FUNCTIONS

  //Find key is needed by another database function that means it must be defined globally in this module (at the top!!!)
  findKey: findKey
}
