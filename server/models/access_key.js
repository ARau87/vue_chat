const mongoose = require('mongoose');
const { Schema } = mongoose;

const keySchema = new Schema({
  key: {type:String, required:true},
});

mongoose.model('keys', keySchema, 'keys');
