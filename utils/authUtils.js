import jwtDecode from 'jwt-decode'
import Cookie from 'js-cookie'
import cookies from 'browser-cookies'
import moment from 'moment'
import { toastr } from 'react-redux-toastr'
import {
  logUserOut,
  refreshTokenAction,
  logOut,
  saveUserToRedux
} from '../actions/authActions'
import actionTypes from '../actions/actionTypes'

// Currently not used
export const setToken = token => {
  if (!process.browser) {
    return
  }
  window.localStorage.setItem('token', token)
  window.localStorage.setItem('user', JSON.stringify(jwtDecode(token)))
  // Cookie.set('jwt', token)
  // cookies.set('jwt', token, {
  //   expires: 365,
  //   path: 'http://localhost:3000/'
  // })
}

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

// Currently unused
export const getUserFromLocalStorage = () => {
  const json = window.localStorage.user
  return json ? JSON.parse(json) : undefined
}

// Currently unused
export const getUserFromCookie = req => {
  if (!req.headers.cookie) {
    return undefined
  }
  const jwtCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('jwt='))
  if (!jwtCookie) {
    return undefined
  }
  const jwt = jwtCookie.split('=')[1]
  return jwtDecode(jwt)
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

export const getTokenFromCookieRes = cookies => {
  return cookies[0]
    .split(';')
    .find(c => c.trim().startsWith('jwt='))
    .split('=')[1]
}

export const getCookiesFromServerResponse = ctxHeaders => {
  const resCookies = ctxHeaders['set-cookie']
  return resCookies
}

export const findTokenToDecode = (ctxHeaders, ctxReq) => {
  const cookies = getCookiesFromServerResponse(ctxHeaders)
  if (cookies) {
    console.log('has new user')

    return getTokenFromCookieRes(cookies)
  } else {
    console.log('no new user, use original token')
    return getTokenFromCookie(ctxReq)
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
  const tokenDecoded = jwtDecode(token)
  console.log('user from JWT')
  console.log(tokenDecoded)

  const allowedKeys = ['name', 'email', 'exp']
  return Object.keys(tokenDecoded)
    .filter(key => allowedKeys.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: tokenDecoded[key]
      }
    }, {})
}

// Not currently used
export const isTokenExpired = token => {
  let jwt = token
  if (jwt) {
    let jwtExp = jwt.exp
    const currentTime = moment().unix()
    const expired = jwtExp < currentTime // because time goes up
    // let expiryDate = new Date(0)
    // expiryDate.setUTCSeconds(jwtExp)

    if (expired) {
      return true
    }
  }

  return false
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
  const refreshWindow = 15 // min
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

// Not sure if this is used
export const handleError = async (e, store) => {
  console.log('handleError from AuthUtils')
  console.log(e)

  if (e.logout) {
    toastr.error('Error:', e.message)
    store.dispatch(logUserOut())
    // Router.push(`/auth/login`, `/login`)
  }

  toastr.error('Error:', e.message)
  // throw e.message
}

/**
 * validateUserToken(arg)
 *
 * @param {Boolean} server-side check
 * @param {Object} Redux Store
 * @param {Object} user
 * @returns {Dispatch Action: logOut}
 * @returns {Dispatch Action: logUserOut}
 * @returns {Dispatch Action: refreshToken}
 * @returns {Dispatch Action: saveUserToRedux}
 */
export const validateUserToken = async (isBrowser, store, user) => {
  console.log('validateUser', user)

  if (!user) {
    return store.dispatch(logOut())
  }

  // if expired log user out
  if (isUserExpired(user)) {
    console.log('user is expired')
    try {
      await store.dispatch(logUserOut())
    } catch (e) {
      console.log('log user out error')
    }
    return
  }

  // if expired log user out
  if (tokenNeedsRefresh(user) && !isBrowser) {
    console.log('user needs new token')
    // Make api call and dispatch update
    // Middleware should auto detect the updated tokens param and dispatch action accordingly
    try {
      await store.dispatch(refreshTokenAction())
    } catch (e) {
      console.log('refresh Error')
      console.log(e)
    }
    return
  }

  /*
  If on the server - its a hard refresh so we need to populate redux
  */
  if (isBrowser) {
    console.log('on server load user into Redux')
    return store.dispatch(saveUserToRedux(user))
  }
}

// export const fetchCookiesForheader = cookies => {
//   const allowedKeys = ['jwt', '_csrf']
//   const array = cookies.split(';').map(c => {
//     if (c.trim().startsWith('jwt=')) {
//       return c
//     }
//     if (c.trim().startsWith('_csrf=')) {
//       return c
//     }
//   })
//   // .find(c => c.trim().startsWith('jwt='))
//   console.log('new array')
//   console.log(array)
// }
