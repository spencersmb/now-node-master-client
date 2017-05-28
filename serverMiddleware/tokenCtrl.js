const tokenUtils = require('../utils/serverUtilsTokens')
/*
* This middleware attaches USER to the req if a user is present
* from a token refresh
*/

exports.tokenRefreshCheck = async (req, res, next) => {
  // req.body.photo = s3File.getUrlPath()
  console.log('req cookies from token ctrl')
  console.log(req.cookies)

  const jwt = tokenUtils.extractJWTFromCookieParser(req.cookies)

  // IF TOKEN IS EXPIRED?

  if (!tokenUtils.checkTokenRefreshTime(jwt)) {
    next()
    return
  }
  // // refresh token
  const newTokens = await tokenUtils.getNewTokens(req.headers.cookie)

  console.log('new tokens')
  console.log(newTokens)

  newTokens.map(token => res.append('Set-Cookie', token))
  console.log('body')
  console.log(req.body)

  // res.append('Set-Cookie', newCookies[0])
  // res.append('Set-Cookie', newCookies[1])

  // push user through to front end and make front end check for user and then push to redux
  const jwtToken = tokenUtils.getJwtFromCookie(newTokens[0])
  req.user = tokenUtils.extractUserFromJwt(jwtToken)
  next()
}
