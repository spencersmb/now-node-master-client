import actionTypes from './actionTypes'
import authApi from '../api/authApi'
import { unsetToken } from '../utils/authUtils'

export const signinUser = user => async dispatch => {
  const request = authApi.signInUser(user)

  return dispatch({
    type: actionTypes.LOG_USER_IN,
    payload: request // request = Promise, must send data on key 'payload`
  })
}

export const saveUserToRedux = user => dispatch =>
  dispatch({
    type: actionTypes.SAVE_USER,
    user
  })

export const authenticateUser = user => async dispatch => {
  const response = authApi.registerUser(user)

  return dispatch({
    type: actionTypes.CREATE_USER,
    payload: response // request = Promise, must send data on key 'payload`
  })
}

export const logUserOut = () => async dispatch => {
  try {
    await authApi.signOutUser()
    dispatch(logOut())
    unsetToken()
    console.log('Async action signout complete')
    return
  } catch (e) {
    throw e
  }
}

export const logOut = () => ({ type: actionTypes.LOG_OUT })

export const refreshTokenAction = user => dispatch => {
  const request = authApi.fetchRefreshTokens(user)

  return dispatch({
    type: 'FETCH_NEW_TOKENS',
    payload: request
  })
}

export const loadAccountForm = user => {
  return {
    type: actionTypes.LOAD_USER_DATA,
    user
  }
}

export const updateUser = user => dispatch => {
  const request = authApi.updateUser(user)

  return dispatch({
    type: actionTypes.UPDATE_USER,
    payload: request // request = Promise, must send data on key 'payload`
  })
}

export const forgotUser = email => dispatch => {
  const request = authApi.forgotUser(email)

  return dispatch({
    type: actionTypes.FORGOT_USER,
    payload: request // request = Promise, must send data on key 'payload`
  })
}

export const resetPassword = passwordToken => dispatch => {
  const request = authApi.resetPassword(passwordToken)

  return dispatch({
    type: actionTypes.RESET_PASSWORD,
    payload: request // request = Promise, must send data on key 'payload`
  })
}

export const getUserHearts = cookies => dispatch => {
  const request = authApi.getUserHearts(cookies)

  return dispatch({
    type: actionTypes.GET_USER_HEARTS,
    payload: request // request = Promise, must send data on key 'payload`
  })
}

// export const refreshTokenActionServer = cookies => dispatch => {
//   console.log('refreshtokenAction called')

//   const request = authApi.fetchRefreshTokensServer(cookies)

//   return dispatch({
//     type: 'FETCH_NEW_TOKENS',
//     payload: request
//   })
// }

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

// export const authenticateUser = user => async dispatch => {
//   /**
//    * 1. Make API CALL to POST user
//    * 2. on success - setToken to localStorage/cookie
//    * 3. decode user from localStorage and set in redux for AUTH
//    */
//   try {
//     const response = await authApi.registerUser(user)
//     const decodedUser = getUserFromJWT(response.token)
//     return dispatch(saveUserToRedux(decodedUser))
//     // setToken(response.token)
//     // return dispatch(saveUserToRedux(getUserFromLocalStorage()))
//   } catch (e) {
//     throw e
//   }
// }
