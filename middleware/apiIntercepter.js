import { handleStatusCheck } from '../utils/storeHelpers'
import { getUserFromJWT } from '../utils/authUtils'
import actionTypes from '../actions/actionTypes'

export default function ({ dispatch }) {
  console.log('Middleware test')
  return next => async action => {
    // If action does not have payload
    // or, the payload is not a promise
    // send it on
    console.log('action')
    console.log(action.type)

    if (!action.payload || !action.payload.then) {
      return next(action)
    }

    const response = await action.payload

    console.log('es6 await promise in middleware')
    // console.log(JSON.stringify(response, null, 2))
    console.log(response.status)
    console.log(response.statusText)
    console.log(response.headers)
    // res.cookie('jwt', token, {
    //   httpOnly: true
    // })

    // ADD GLOBAL RESPONSE FUNCTION HERE WITH DISPATHC LOGOUT
    await handleStatusCheck(response, dispatch)

    console.log('json body')
    const body = await response.json()
    console.log(body)

    if (body.token) {
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

    console.log('new action')
    console.log(newAction)

    // Send through all the middlewares again
    dispatch(newAction)
    return body.data
  }
}
