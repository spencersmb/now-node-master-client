import fetch from 'isomorphic-unfetch'
import { initStore } from '../store'
import { getUserFromJWT } from '../utils/authUtils'
import actionTypes from '../actions/actionTypes'

export const fetchIntercepter = async (url, options = {}, dispatch = {}) => {
  const response = await fetch(url, { ...options })
  const body = await response.json()

  if (body.token) {
    const decodedUser = getUserFromJWT(body.token)

    dispatch({
      type: actionTypes.LOGIN_SUCCESS,
      user: { ...decodedUser }
    })
  }

  return body
}

// if you log someone out on a protected route but dont Route them - what happens TODO example with HOC secure route

// export const fetchIntercepter = (url, options = {}) => {
//   console.log('options')
//   console.log({ ...options })

//   return fetch(url, { ...options }).then(r => {
//     console.log('intercepter')
//   })
// }
