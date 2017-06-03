import { toastr } from 'react-redux-toastr'
import Router from 'next/router'
import { logUserOut } from '../actions/authActions'
/**
 * handleMiddlewareError(arg) -DEPRICATED-
 * - This function SHOULD BE updated once old async calls are routed through the middleware
 * - No logout errror OBJ will be sent out so update accordingly
 * - Currently this is in storeAPI.js
 *
 * @param {Object} error
 * @param {Object} redux dispatch
 */
export const handleMiddlewareError = async (e, dispatch) => {
  console.log('handleError from AuthUtils to be UPDATED and FIXED')
  console.log(e)

  if (e.logout) {
    toastr.error('Error:', e.message)
    // dispatch(logUserOut())
    console.log(
      'SHOULD LOG USER OUR, BUT SHOULD HAPPEN WITH MIDDLEWARE NOT ERROR HANDLER'
    )

    Router.push(`/auth/login`, `/login`)
  }

  if (e.showMid) {
    toastr.error('Error:', e.message)
  }
}

/**
 * handleStatusCheck(res, dispatch)
 * - Redux Middleware apiIntercepter status check
 * - Used to upload files/photos
 *
 * @param {Object} api response
 * @param {Function} dispatch
 * @returns Action dispatch( logUserOut )
 * @returns {Error}
 */
export const handleStatusCheck = async (response, dispatch, actionType) => {
  console.log('handle Status Check')

  const error = {
    showMid: false,
    message: 'There was an error'
  }

  if (response.status === 401 && actionType === 'LOG_USER_IN') {
    error.message = 'Incorrect Username or password'
    throw error
  }

  if (response.status === 401) {
    error.showMid = true
    error.message = 'Please login again'
    await dispatch(logUserOut())
    throw error
  }

  if (response.status !== 200) {
    error.message = response.statusText
    throw error
  }
}
