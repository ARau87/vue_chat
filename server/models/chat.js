// Model representing a user of the application
const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
  name: {type:String, required:true},
  num_of_users: Number,
  users: [{username: String, nickname: String}],
  created: Date
});

mongoose.model('chats', chatSchema, 'chats');
