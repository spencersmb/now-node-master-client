import actionTypes from './actionTypes'
import authApi from '../api/authApi'
import {
  isUserExpired,
  setToken,
  getUserFromLocalStorage,
  getUserFromJWT,
  unsetToken
} from '../utils/authUtils'
// import { checkTokenExpiry, unsetToken } from '../utils/auth'
// import { logout } from '../utils/lock'

export const signinUser = user => async dispatch => {
  console.log('signin user action first called')

  try {
    const response = await authApi.signInUser(user)
    console.log('signin User action')
    // console.log(response)
    const decodedUser = getUserFromJWT(response.token)
    // console.log('Decoded User', decodedUser)

    // setToken(response.token)
    return dispatch(saveUserToRedux(decodedUser))
  } catch (e) {
    throw e
  }
}

// THIS NEEDS TO BE UPDATED
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
    return dispatch(saveUserToRedux(getUserFromLocalStorage()))
  } catch (e) {
    throw e
  }
}

export const saveUserToRedux = user => ({
  type: actionTypes.LOGIN_SUCCESS,
  user
})

// Not currently Used
// Used on the auth/signed-in.js & AUTH0 Class
export const SaveUser = user => dispatch => {
  return dispatch({ type: actionTypes.LOGIN_SUCCESS, user })
}

// Used on the auth/sign-off.js
export const logUserOut = () => async dispatch => {
  try {
    await authApi.signOutUser()
    unsetToken()
    dispatch(logOut())
    console.log('Async action signout complete')
    return
  } catch (e) {
    throw e
  }
}

export const logOut = () => ({ type: actionTypes.LOG_OUT })

export const refreshTokenAction = () => dispatch => {
  console.log('refreshtokenAction called')

  const request = authApi.fetchRefreshTokens()

  return dispatch({
    type: 'FETCH_NEW_TOKENS',
    payload: request
  })
}

export const refreshTokenActionServer = cookies => dispatch => {
  console.log('refreshtokenAction called')

  const request = authApi.fetchRefreshTokensServer(cookies)

  return dispatch({
    type: 'FETCH_NEW_TOKENS',
    payload: request
  })
}

// export const refreshUser = user => {
//   return { type: actionTypes.REFRESH_USER, user }
// }

// export const validateUserToken = (user, isServer) => {
//   console.log('validateUser', user)

//   if (!user) {
//     return { type: actionTypes.LOG_OUT }
//   }

//   // if expired returns true
//   if (isUserExpired(user)) {
//     console.log('user is expired')
//     // dispatch(logUserOut())
//     return logUserOut()
//   }

//   /*
//   If we are not on the server the user is already in redux, if on the server - its a hard
//   refresh so we need to populate redux
//   */
//   if (isServer) {
//     return { type: actionTypes.LOGIN_SUCCESS, user }
//   }
// }
