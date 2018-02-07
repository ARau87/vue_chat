if(process.env.NODE_ENV === 'production'){
  module.exports = {
    mongoURI: process.env.MONGO_URI,
    cookieKey: process.env.COOKIE_KEY
  }
}
else {
  module.exports = require('./dev');
}
