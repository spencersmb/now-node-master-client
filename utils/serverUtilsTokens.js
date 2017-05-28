const jwtDecode = require('jwt-decode')
const moment = require('moment')
const fetch = require('isomorphic-unfetch')

exports.extractJWTFromCookieParser = cookies => {
  const jwt = cookies.jwt
  return jwtDecode(jwt)
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
  if (!token.exp) {
    return
  }

  const currentTime = moment().unix()
  const refreshWindow = 15 // min
  const duration = token.exp - currentTime
  const timeLeft = moment.duration(duration * 1000, 'milliseconds')
  const minLeft = moment.duration(timeLeft).minutes()

  console.log('min left until exp')
  console.log(minLeft)

  if (minLeft <= refreshWindow && minLeft > 0) {
    return true
  }

  return false
}

exports.getNewTokens = async cookies => {
  const response = await fetch('http://localhost:3000/api/api/refresh', {
    method: 'GET',
    headers: {
      cookie: cookies
    },
    credentials: 'include' // here's the magical line that fixed everything
  })
  console.log('fetch response')
  console.log(JSON.stringify(response, null, 2))

  const responseCookies = response.headers
  return responseCookies._headers['set-cookie']
}
