import { getUserFromJWT } from '../utils/authUtils'
import {
  handleMiddlewareError,
  handleStatusCheck
} from '../utils/errorHandlers'
import actionTypes from '../actions/actionTypes'

export default function ({ dispatch }) {
  return next => async action => {
    // console.log('Middleware')
    // console.log('action')
    // console.log(action.type)

    /**
     * - If action object does not have key "payload"
     * - Or the payload is not a promise
     * - Ignore apiInterceptor
     *
     */
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

      await handleStatusCheck(response, dispatch, action.type)

      const body = await response.json()

      // console.log('body from middleware')
      // console.log(body)
      // console.log('action type')
      // console.log(action.type)

      if (body.token && action.type === 'LOG_USER_IN') {
        // Currently this action has no reducer
        const newAction = {
          type: action.type,
          data: {
            token: body.token,
            hearts: body.hearts
          }
        }

        // Send through all the middlewares again
        dispatch(newAction)

        // MODIFY CREATE TO DO THE SAME THING WITH HEARTS
        return {
          token: body.token,
          hearts: body.hearts
        }
      }

      if (body.token && action.type === 'CREATE_USER') {
        const newAction = {
          type: action.type,
          data: body.token
        }

        // Send through all the middlewares again
        dispatch(newAction)
        return body.token
      }

      if (body.token && action.type !== 'LOG_OUT') {
        console.log('body has token in it')
        console.log('save new user to redux')

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

      // console.log('new action')
      // console.log(newAction)

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
