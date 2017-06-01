const tokenUtils = require('../utils/serverUtilsTokens')
/*
* This middleware attaches USER to the req if a user is present
* from a token refresh
*/

exports.tokenRefreshCheck = async (req, res, next) => {
  // Check for cookies coming from browser
  // console.log('req cookies from token ctrl')

  const jwt = tokenUtils.extractJWTFromCookieParser(req.cookies)
  console.log('JWT')
  console.log(jwt)

  if (!jwt) {
    console.log('no token found next.js server')
    next()
    return
  }

  // IF TOKEN IS EXPIRED?
  if (tokenUtils.isExpired(jwt)) {
    console.log('token expired next js server')

    res.clearCookie('jwt')
    res.clearCookie('_CSRF')
    next()
    return
  }

  // does token need refresh
  if (!tokenUtils.checkTokenRefreshTime(jwt)) {
    next()
    return
  }

  // // refresh token
  const newTokens = await tokenUtils.getNewTokens(req.headers.cookie)

  // Check for new tokens coming from API
  // console.log('new tokens')
  // console.log(newTokens)

  newTokens.map(token => res.append('Set-Cookie', token))

  next()
}
