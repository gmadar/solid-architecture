const passport = require('passport')
const PromiseRouter = require('express-promise-router')
const jwt = require('jsonwebtoken')
const Status = require('http-status')

const { success } = require('../utils/httpResponses')
const config = require('../../../infrastructure/config')

const AuthenticationController = {
  get router () {
    const router = PromiseRouter()

    // When user wants to login, he goes to this route, which redirects to facebook
    router.get('/facebook/start',
      passport.authenticate('facebook',
        { scope: ['email', 'public_profile', 'user_location', 'user_gender'], session: false }))

    // This route is where facebook redirects back to us, with their FB Access Token
    router.get('/facebook/redirect',
      passport.authenticate('facebook', { session: false }),
      redirectRequestHandler)

    router.get('/google/start',
      passport.authenticate('google',
        { session: false, scope: ['openid', 'profile', 'email'] }))
    router.get('/google/redirect',
      passport.authenticate('google', { session: false }),
      redirectRequestHandler)

    router.get('/me', passport.authenticate(['jwt'], { session: false }), this.me)

    return router
  },

  me: async (req, res, next) => {
    const currUser = req.user
    res.status(Status.OK).json(success(currUser))
  }
}

module.exports = AuthenticationController

function redirectRequestHandler (req, res) {
  // we generate our own JWT access toekn
  const accessToken = generateAccessToken(req.user.id)

  // We render an html page, which sends our JWT back to the SPA app
  res.render('authenticated.html', {
    token: accessToken
  })
}

// Generate our JWT Access Token for the given User ID
function generateAccessToken (userId) {
  // const expiresIn = '1 hour'
  const issuer = config.get('authentication.token.issuer')
  const secret = config.get('authentication.token.secret')
  const audience = ''

  const token = jwt.sign({}, secret, {
    // expiresIn: expiresIn,
    audience: audience,
    issuer: issuer,
    subject: userId.toString()
  })

  return token
}
