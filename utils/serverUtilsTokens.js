const jwtDecode = require('jwt-decode')
const moment = require('moment')
const fetch = require('isomorphic-unfetch')
const config = require('../config/envConfigServer')
// const envConfig = require('../../server')

exports.extractJWTFromCookieParser = cookies => {
  console.log('cookies - extractJWTFromCookieParser')
  console.log(cookies)

  if (!cookies.jwt) {
    return undefined
  }
  // const jwt = cookies.jwt
  return jwtDecode(cookies.jwt)
}

exports.extractUserFromJwt = jwt => {
  const jwtDecoded = jwtDecode(jwt)
  return {
    email: jwtDecoded.email,
    name: jwtDecoded.name,
    exp: jwtDecoded.exp
  }
}

exports.getJwtFromCookie = cookie => {
  return cookie.split(';').find(c => c.trim().startsWith('jwt=')).split('=')[1]
}

exports.checkTokenRefreshTime = token => {
  if (!token) {
    return
  }
  // console.log('config')
  // console.log(config.REFRESH_WINDOW)

  const currentTime = moment().unix()
  const refreshWindow = 15 // min
  const duration = token.exp - currentTime
  const timeLeft = moment.duration(duration * 1000, 'milliseconds')
  const minLeft = moment.duration(timeLeft).minutes()

  console.log('min left until exp')
  console.log(minLeft)

  if (minLeft < refreshWindow && minLeft > 0) {
    return true
  }

  return false
}

exports.isExpired = token => {
  const currentTime = moment().unix()
  const expired = token.exp < currentTime
  console.log('is expired? ', expired)

  return token.exp < currentTime // because time goes up
}

exports.getNewTokens = async cookies => {
  const response = await fetch(`${config.envConfig.BACKEND_URL}/refresh`, {
    method: 'GET',
    headers: {
      cookie: cookies
    },
    credentials: 'include' // here's the magical line that fixed everything
  })
  // check full response from the API request
  // console.log('fetch response')
  // console.log(JSON.stringify(response, null, 2))

  // Split up header to return object hack
  const responseCookies = response.headers
  return responseCookies._headers['set-cookie']
}
