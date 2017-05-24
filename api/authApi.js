import fetch from 'isomorphic-unfetch'
import env from '../config/envConfig'

class authApi {
  static async signInUser (user) {
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

    if (response.status !== 200) {
      console.log('error')

      const error = {
        message: body.message
      }

      throw error.message
    }
    console.log(body)

    return body
  }
  static async signOutUser () {
    const url = `${env.BACKEND_URL}/signout`
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
    const url = `${env.BACKEND_URL}/register`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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
}

export default authApi
