// Model representing a user of the application
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {type:String, required:true},
  password: {type:String, required:true},
  image: {type:String},
  nickname: {type:String, required:true},
  created: {type:String, required:true},
  isLoggedIn: {type:Boolean, default:false}
});

mongoose.model('users', userSchema, 'users');
