const email = (email) => {
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};

const password = (password) => {
  return (password.length >= 8);
};

const registration = (user) => {
  return (email(user.username) && password(user.password))
}


module.exports = {
  email: email,

  password: password,

  registration: registration
};
