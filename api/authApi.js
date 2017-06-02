import fetch from 'isomorphic-unfetch'
import env from '../config/envConfig'

class authApi {
  static async signInUser (user) {
    console.log('signin user api CALL')

    const url = `${env.BACKEND_URL}/api/signin`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // mode: 'cors',
      credentials: 'include', // Don't forget to specify this if you need cookies
      body: JSON.stringify(user)
    })

    const body = await response.json()
    console.log('SIGN USER IN CALL DONE')

    if (response.status !== 200) {
      console.log('error')

      const error = {
        message: body.message
      }

      throw error.message
    }
    // console.log(body)

    return body
  }
  static async signOutUser () {
    console.log('Sign user out')

    const url = `${env.BACKEND_URL}/api/signout`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // mode: 'cors',
      credentials: 'include' // Don't forget to specify this if you need cookies
    })

    const body = await response.json()

    if (response.status !== 200) {
      console.log('error')

      const error = {
        message: body.message
      }

      throw error.message
    }
    return body
  }
  static async registerUser (user) {
    const url = `${env.BACKEND_URL}/api/register`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Don't forget to specify this if you need cookies
      body: JSON.stringify(user)
    })

    const body = await response.json()
    console.log('body')
    console.log(body)

    if (response.status !== 200) {
      //
      // check for multiple errors on registration
      //
      if (body.errors) {
        const error = {
          errors: body.errors
        }

        throw error.errors
      } else {
        const error = {
          message: body.message
        }

        throw error.message
      }
    }

    return body
  }
  static async fetchRefreshTokens () {
    // Must create FormData when posting an image
    const url = `${env.BACKEND_URL}/api/refresh`
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include' // Don't forget to specify this if you need cookies
    })

    return response
  }
  static async fetchRefreshTokensServer (cookies) {
    // Must create FormData when posting an image
    const url = `${env.BACKEND_URL}/api/refresh`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        cookie: cookies
      },
      credentials: 'include' // here's the magical line that fixed everything
    })

    return response
  }
}

export default authApi
