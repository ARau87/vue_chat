const database = require('./database');

//Create io instances for each chat created in database
const createIoChats = (io) => {
  const chats = database.getAllChats()
                        .then((chats) => {
                          io.of('/lobby')
                            .on('connection', (client) => {
                              console.log('[IO] Client entered lobby!');
                            });
                          chats.forEach(function(chat){
                            var room = io.of('/' + chat.name)
                                         .on('connection', (client) => {
                                            console.log('[IO] Client connected to', chat.name);
                                            handleClientActions.apply(this,[client, room, chat.name]);
                                         });
                          });
                        })
}

const newChat = (io, name) => {
  const chat = database.findChat(name)
                       .then(function(chat){
                          var room = io.of('/' + chat.name)
                                       .on('connection', (client) => {
                                          console.log('[IO] Client connected to', chat.name);
                                          handleClientActions.apply(this, [client,room, chat.name]);
                                        });
                       });
};

const handleClientActions = (client, room, chatname) => {
  client.on('entered', (message) => {
    console.log(message);
    database.addChatUser(chatname, message.user)
            .then((user) => {
              if(user){
                console.log('[IO] User', message.user, 'said:', message.body);
                room.emit('user-entered', message);
              }
              else {
                console.log('[IO] User is already in chat!');
              }
            })
            .catch((err) => console.log('[ERR]', err));
  });
  client.on('chat-message', (message) => {
    console.log('[IO] User', message.user, 'said:', message.body);
    room.emit('user-message', message);
  });
  client.on('disconnected', (message) => {
    database.deleteChatUser(chatname, message.user)
            .then(user => {
              if(user){
                console.log('[IO] User', message.user, 'left room!');
                room.emit('user-left', message);
              }
              else {
                console.log('[IO] User wasn\'t in this chat!');
              }
            })
            .catch(err => console.log('[ERR]',err));
    room.emit('user-left', message);
  });

};

module.exports = {

  setup: createIoChats,
  newChat: newChat
};
