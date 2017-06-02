import { handleStatusCheck } from '../utils/storeHelpers'
import { getUserFromJWT, handleMiddlewareError } from '../utils/authUtils'
import actionTypes from '../actions/actionTypes'

export default function ({ dispatch }) {
  return next => async action => {
    // console.log('Middleware')
    // console.log('action')
    // console.log(action.type)

    // If action does not have payload
    // or, the payload is not a promise
    // send it on
    if (!action.payload || !action.payload.then) {
      return next(action)
    }

    try {
      const response = await action.payload

      // DEBUG
      // console.log('es6 await promise in middleware')
      // console.log(JSON.stringify(response, null, 2))
      // console.log(response.status)
      // console.log(response.statusText)
      // console.log(response.headers)

      await handleStatusCheck(response, dispatch)

      const body = await response.json()

      console.log('body from middleware')
      console.log(body)

      // Check for logout so you dont refresh tokens after logout
      // if(action.type === 'LOG_OUT'){

      // }
      console.log('action type')
      console.log(action.type)

      if (body.token && action.type !== 'LOG_OUT') {
        // console.log('body has token in it')
        // console.log('save new user to redux')

        const decodedUser = getUserFromJWT(body.token)

        dispatch({
          type: actionTypes.REFRESH_TOKEN,
          user: { ...decodedUser }
        })
      }

      const newAction = {
        type: action.type,
        data: body.data
      }

      console.log('new action')
      console.log(newAction)

      // Send through all the middlewares again
      dispatch(newAction)
      return body.data
    } catch (e) {
      console.log('middleware error')
      handleMiddlewareError(e, dispatch)
      throw e
    }
  }
}
