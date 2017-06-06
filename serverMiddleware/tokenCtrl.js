const tokenUtils = require('../utils/serverUtilsTokens')
/*
* This middleware attaches USER to the req if a user is present
* from a token refresh
*/

exports.tokenRefreshCheck = async (req, res, next) => {
  console.log('REFRESH CHECK in EXPRESS')

  // Check for cookies coming from browser
  // console.log('req cookies from token ctrl')

  const jwt = tokenUtils.extractJWTFromCookieParser(req.cookies)
  // console.log('JWT')
  // console.log(jwt)

  if (!jwt) {
    console.log('no token found next.js server')
    next()
    return
  }

  const expired = tokenUtils.isExpired(jwt)

  if (!expired) {
    console.log('jwt found but not expired')
    next()
    return
  }

  console.log('token expired on next js server')

  // // refresh token
  const newTokens = await tokenUtils.getNewTokens(req.headers.cookie)

  // Check for new tokens coming from API
  // console.log('new tokens')
  // console.log(newTokens)
  if (newTokens) {
    newTokens.map(token => res.append('Set-Cookie', token))
  }
  next()
}
