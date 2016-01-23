var request = require('superagent')
var emailValidator = require('email-validator')

module.exports.validateUsername = function (username, done) {
  var re = /^\w+$/
  if (username !== '') { // check if entered username
    if (re.test(username)) { // check if entered username mathces style
      if (typeof window === 'undefined') { // on server
        return done(null, { valid: true })
      } else { // we're on the client, so let's check if username is taken
        return checkIfUsernameTaken(username, done)
      }
    } else {
      return done(new Error('unInvalidError'))
    }
  } else {
    return done(new Error('unEmptyError'))
  }
}

function checkIfUsernameTaken (username, done) {
  request
  .get(`/api/users/username/${username}`)
  .send({username: username})
  // .set('X-API-Key', 'foobar')
  .set('Accept', 'application/json')
  .end(function (err, res) {
    if (err && res.status === 404) {
      return done(null, {valid: true})
    } else if (res.body.username === username) {
      return done(new Error('unTakenError'))
    } else {
      return done(new Error('problemConnectingToServerError'))
    }
  })
}

module.exports.validateEmail = function (email, done) {
  if (emailValidator.validate(email)) {
    if (typeof window === 'undefined') { // on server
      return done(null, { valid: true })
    } else { // we're on the client, so let's check if username is taken
      return checkIfEmailTaken(email, done)
    }
  } else {
    done(new Error('emailInvalidError'))
  }
}

function checkIfEmailTaken (email, done) {
  request
  .get(`/api/users/email/${email}`)
  .send({username: email})
  // .set('X-API-Key', 'foobar')
  .set('Accept', 'application/json')
  .end(function (err, res) {
    if (err && res.status === 404) {
      return done(null, {valid: true})
    } else if (res.body.email === email) {
      return done(new Error('emailTakenError'))
    } else {
      return done(new Error('problemConnectingToServerError'))
    }
  })
}

module.exports.validatePassword = function (password, repeat, done) {
  console.log(password, repeat)
  // username is valid
  if (password === repeat) {
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/
    if (re.test(password)) {
      return done(null, { valid: true })
    } else {
      return done(new Error('pwCharsError'))
    }
  } else {
    return done(new Error('pwMatchError'))
  }
}