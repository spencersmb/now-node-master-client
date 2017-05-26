import jwtDecode from 'jwt-decode'
import Cookie from 'js-cookie'
import cookies from 'browser-cookies'
import moment from 'moment'
import { toastr } from 'react-redux-toastr'
import { logUserOut } from '../actions/authActions'
import actionTypes from '../actions/actionTypes'

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

export const unsetToken = () => {
  if (!process.browser) {
    return
  }
  // window.localStorage.removeItem('token')
  // window.localStorage.removeItem('user')
  // Cookie.remove('jwt')

  window.localStorage.setItem('logout', Date.now())
}

export const getUserFromLocalStorage = () => {
  const json = window.localStorage.user
  return json ? JSON.parse(json) : undefined
}

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

export const getUserFromJWT = token => {
  const tokenDecoded = jwtDecode(token)
  console.log('tokenDecoded function', tokenDecoded)

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

export const handleError = async (e, store) => {
  console.log(e)

  if (e.logout) {
    toastr.error('Error:', e.message)
    store.dispatch(logUserOut())
    // Router.push(`/auth/login`, `/login`)
  }

  toastr.error('Error:', e.message)
  // throw e.message
}

export const validateUserToken = (isBrowser, store, user) => {
  console.log('validateUser', user)

  if (!user) {
    return store.dispatch({ type: actionTypes.LOG_OUT })
  }

  // if expired returns true
  if (isUserExpired(user)) {
    console.log('user is expired')
    // dispatch(logUserOut())
    return store.dispatch(logUserOut())
  }

  /*
  If we are not on the server the user is already in redux, if on the server - its a hard
  refresh so we need to populate redux
  */
  if (!isBrowser) {
    return store.dispatch({ type: actionTypes.LOGIN_SUCCESS, user })
  }
}
