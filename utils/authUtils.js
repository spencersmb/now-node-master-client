import jwtDecode from 'jwt-decode'
import moment from 'moment'
import {
  logUserOut,
  refreshTokenAction,
  logOut,
  saveUserToRedux
} from '../actions/authActions'
import envConfig from '../config/envConfig'

/**
 * unsetToken()
 * - Adds logout timestamp to localstorage to trigger event accross tabs
 *
 */
export const unsetToken = () => {
  if (!process.browser) {
    return
  }
  // window.localStorage.removeItem('token')
  // window.localStorage.removeItem('user')
  // Cookie.remove('jwt')

  window.localStorage.setItem('logout', Date.now())
}

/**
 * getTokenFromCookie(arg)
 *
 * @param {Object} request - from Server-side
 * @returns {undefined}
 * @returns {JWT-Token}
 */
export const getTokenFromCookie = req => {
  if (!req.headers.cookie) {
    return undefined
  }
  const jwtCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('jwt='))
  if (!jwtCookie) {
    return undefined
  }
  return jwtCookie.split('=')[1]
}

/**
 * getTokenFromCookieRes(arg) - used specifically for RESPONSE cookies on SSR next.js
 *
 * @param {Object} cookies - from Server-side
 * @returns {JWT-Token}
 */
export const getTokenFromCookieRes = cookies => {
  return cookies[0]
    .split(';')
    .find(c => c.trim().startsWith('jwt='))
    .split('=')[1]
}

/**
 * getCookiesFromServerResponse(arg)
 * - Helper hack to get cookies from headers on Next.js Server response
 *
 * @param {Object} headers - from Server-side
 * @returns {Cookie key/value [array]}
 */
export const getCookiesFromServerResponse = ctxHeaders => {
  const resCookies = ctxHeaders['set-cookie']
  return resCookies
}

/**
 * findTokenToDecode(headers, req)
 * - Next.js Serverside func to first look for new token being sent from API
 * - If none is found on RES, use req headers
 *
 * @param {Object} ctxheaders - from Server-side
 * @param {Object} ctxRequest - from Server-side
 * @returns {Cookie key/value [array]}
 */
export const findTokenToDecode = (ctxHeaders, ctxReq) => {
  const cookies = getCookiesFromServerResponse(ctxHeaders)
  console.log('find token on server')

  if (cookies) {
    console.log('has new user')
    return getTokenFromCookieRes(cookies)
  } else {
    console.log('no new user, use original token if there is one')
    return getTokenFromCookie(ctxReq)
  }
}

/**
 * findTokenToDecode(headers, req)
 * - Next.js Serverside func to first look for new token being sent from API
 * - If none is found on RES, use req headers
 *
 * @param {Object} ctxheaders - from Server-side
 * @param {Object} ctxRequest - from Server-side
 * @returns {Cookie key/value [array]}
 */
export const findCookies = (ctxHeaders, ctxReq) => {
  const cookies = getCookiesFromServerResponse(ctxHeaders)
  console.log('find token on server')

  if (cookies) {
    console.log('has new user')
    return cookies
  } else {
    console.log('no new user, use original token if there is one')
    return ctxReq
  }
}

/**
 * getUserFromJWT(arg)
 * - Filter out sensitive info when the token is decoded before adding to redux
 *
 * @param {String} jwt-Token
 * @returns {Object}
 *
 */
export const getUserFromJWT = token => {
  if (!token) {
    return undefined
  }

  // const tokenDecoded = jwtDecode(token)
  // const allowedKeys = ['name', 'email', 'exp', 'rfs']

  // return Object.keys(tokenDecoded)
  //   .filter(key => allowedKeys.includes(key))
  //   .reduce((obj, key) => {
  //     return {
  //       ...obj,
  //       [key]: tokenDecoded[key]
  //     }
  //   }, {})

  return jwtDecode(token)
}

/**
 * isUserExpired(arg)
 *
 * @param {Object} user
 * @returns {Boolean}
 *
 */
export const isUserExpired = user => {
  if (user.exp) {
    const currentTime = moment().unix()
    const expired = user.exp < currentTime // because time goes up
    // let expiryDate = new Date(0)
    // expiryDate.setUTCSeconds(jwtExp)

    if (expired) {
      return true
    }
  }

  return false
}

/**
 * tokenNeedsRefresh(arg)
 * - Checks user exp timestamp and decides if it is within window to refresh token
 *
 * @param {Object} user
 * @returns {Boolean}
 *
 */
export const tokenNeedsRefresh = user => {
  if (!user) {
    return
  }

  const currentTime = moment().unix()
  const refreshWindow = envConfig.REFRESH_WINDOW // min
  const duration = user.exp - currentTime
  const timeLeft = moment.duration(duration * 1000, 'milliseconds')
  const minLeft = moment.duration(timeLeft).minutes()

  console.log('min left until exp')
  console.log(minLeft)

  if (minLeft <= refreshWindow && minLeft > 0) {
    return true
  }

  return false
}

/**
 * validateUserToken(arg, user)
 *
 * @param {Object} Redux Store
 * @param {Object} user
 * @returns {Dispatch Action: logOut}
 * @returns {Dispatch Action: logUserOut}
 * @returns {Dispatch Action: refreshToken}
 * @returns {Dispatch Action: saveUserToRedux}
 */
export const validateUserTokenClient = async (store, user) => {
  console.log('validateUser-Client')
  if (!user) {
    return store.dispatch(logUserOut())
  }

  // if expired log user out
  if (isUserExpired(user)) {
    console.log('user is expired')
    try {
      await store.dispatch(refreshTokenAction(user))
    } catch (e) {
      console.log('refresh token error')
    }
  }
}

/**
 * validateUserTokenServer(arg, user)
 *
 * @param {Object} Redux Store
 * @param {Object} user
 * @returns {Dispatch Action: logOut}
 * @returns {Dispatch Action: logUserOut} (expired)
 * @returns {Dispatch Action: saveUserToRedux}
 */
export const validateUserTokenServer = async (store, user) => {
  /*
  * find cookies on browser(jwt)
  * find user from token and pass user in to this function from getInitialProps on HOC
  * - if there is no user(undefined) - dispatch logout
  * - if there is a new user
  * - return new user to save to redux
  * - return old user to save to redux
  */
  console.log('validateUser-Server', user)

  if (!user) {
    return store.dispatch(logOut())
  }

  /*
  Save user from token
  */
  console.log('save user')

  store.dispatch(saveUserToRedux(user))
}
