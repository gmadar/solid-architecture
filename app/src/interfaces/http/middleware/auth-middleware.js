const passport = require('passport')
const passportFacebook = require('passport-facebook')
const passportGoogle = require('passport-google-oauth')
const passportJwt = require('passport-jwt')
const _ = require('lodash')

module.exports = (app, cradle) => {
  const { config, logger, getUserByAuthProvider, createUser, getUserById } = cradle

  const facebookConfig = {
    clientID: config.get('authentication.facebook.clientId'),
    clientSecret: config.get('authentication.facebook.clientSecret'),
    callbackURL: `${config.get('server.backendUrl')}/api/authentication/facebook/redirect`,
    profileFields: ['id', 'displayName', 'email', 'picture', 'location', 'gender'],
    enableProof: true
  }
  passport.use(new passportFacebook.Strategy(facebookConfig,
    async function (accessToken, refreshToken, profile, done) {
      logger.debug('user logged-in successfully through Facebook.', profile)

      try {
        const user = await getUserByAuthProvider(profile.id, 'FACEBOOK')
        return done(null, user)
      } catch (err) {
        const { PROVIDER_USER_NOT_EXISTS } = getUserByAuthProvider.codes
        if (err.isOperational) {
          if (err.code === PROVIDER_USER_NOT_EXISTS) {
            const userAuthProvider = {
              id: profile.id,
              provider: 'FACEBOOK',
              displayName: profile.displayName,
              gender: profile.gender,
              email: _.get(profile, 'emails[0].value'),
              email2: _.get(profile, 'emails[1].value'),
              photoUrl: _.get(profile, 'photos[0].value'),
              cityId: _.get(profile, '_json.location.id'),
              cityName: _.get(profile, '_json.location.name')
            }
            const cityId = userAuthProvider.cityName ? mapProviderCityNameToId(userAuthProvider.cityName) : undefined
            const contact = {
              name: userAuthProvider.displayName,
              email: userAuthProvider.email,
              city: cityId ? { id: cityId } : undefined
            }
            const userData = {
              contact,
              userAuthProviders: [userAuthProvider]
            }
            const createdUser = await createUser(userData)
            return done(null, createdUser)
          }
        }
        throw err
      }
    }))

  const googleConfig = {
    clientID: config.get('authentication.google.clientId'),
    clientSecret: config.get('authentication.google.clientSecret'),
    callbackURL: `${config.get('server.backendUrl')}/api/authentication/google/redirect`
  }
  passport.use(new passportGoogle.OAuth2Strategy(googleConfig,
    async function (accessToken, refreshToken, profile, done) {
      logger.debug('user logged-in successfully through Google.', profile)

      try {
        const user = await getUserByAuthProvider(profile.id, 'GOOGLE')
        return done(null, user)
      } catch (err) {
        const { PROVIDER_USER_NOT_EXISTS } = getUserByAuthProvider.codes
        if (err.isOperational) {
          if (err.code === PROVIDER_USER_NOT_EXISTS) {
            const userAuthProvider = {
              id: profile.id,
              provider: 'GOOGLE',
              displayName: profile.displayName,
              gender: profile.gender,
              email: _.get(profile, 'emails[0].value'),
              email2: _.get(profile, 'emails[1].value'),
              photoUrl: _.get(profile, 'photos[0].value')
            }
            const contact = {
              name: userAuthProvider.displayName,
              email: userAuthProvider.email
            }
            const userData = {
              contact,
              userAuthProviders: [userAuthProvider]
            }
            const createdUser = await createUser(userData)
            return done(null, createdUser)
          }
        }
        throw err
      }
    }))

  const jwtOptions = {
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get('authentication.token.secret'),
    issuer: config.get('authentication.token.issuer'),
    audience: ''
  }
  passport.use(new passportJwt.Strategy(jwtOptions, async (payload, done) => {
    try {
      const user = await getUserById(payload.sub)
      if (user) {
        return done(null, user, payload)
      }
      return done()
    } catch (err) {
      return done(err)
    }
  }))

  app.use(passport.initialize())
}

// TODO: add major cities
function mapProviderCityNameToId (cityName) {
  if (cityName.toLowerCase().includes('tel aviv')) {
    return 1
  } else if (cityName.toLowerCase().includes('haifa')) {
    return 5
  }

  return undefined
}
