import actionTypes from './actionTypes'
import authApi from '../api/authApi'
import {
  setToken,
  getUserFromLocalStorage,
  unsetToken
} from '../utils/authUtils'
// import { checkTokenExpiry, unsetToken } from '../utils/auth'
// import { logout } from '../utils/lock'

export const validateUserToken = user => {
  if (!user) {
    return { type: actionTypes.LOG_OUT }
  }

  // if expired returns false it means its (expired)
  // if (!checkTokenExpiry(user)) {
  //   return logUserOut()
  // }

  return { type: actionTypes.LOGIN_SUCCESS, user }
}

export const signinUser = user => async dispatch => {
  try {
    const response = await authApi.signInUser(user)
    setToken(response.token)
    return dispatch({
      type: actionTypes.LOGIN_SUCCESS,
      user: getUserFromLocalStorage()
    })
  } catch (e) {
    throw e
  }
}

// Used on the auth/signed-in.js & AUTH0 Class
export const authenticateUser = user => async dispatch => {
  /**
   * 1. Make API CALL to POST user
   * 2. on success - setToken to localStorage/cookie
   * 3. decode user from localStorage and set in redux for AUTH
   */
  try {
    const response = await authApi.registerUser(user)
    setToken(response.token)
    return dispatch({
      type: actionTypes.LOGIN_SUCCESS,
      user: getUserFromLocalStorage()
    })
  } catch (e) {
    throw e
  }
}

// Used on the auth/signed-in.js & AUTH0 Class
export const SaveUser = user => dispatch => {
  return dispatch({ type: actionTypes.LOGIN_SUCCESS, user })
}

// Used on the auth/sign-off.js
export const logUserOut = () => {
  unsetToken()
  // logout()
  return { type: actionTypes.LOG_OUT }
}

export const refreshUser = user => {
  return { type: actionTypes.REFRESH_USER, user }
}
