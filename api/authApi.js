import fetch from 'isomorphic-unfetch'
import env from '../config/envConfig'

class authApi {
  static async getUserHearts (cookies = undefined) {
    const url = `${env.BACKEND_URL}/api/account/favs`
    if (!cookies) {
      return fetch(url, {
        method: 'GET',
        credentials: 'include'
      })
    }
    return fetch(url, {
      method: 'GET',
      headers: {
        cookie: cookies
      },
      credentials: 'include'
    })
  }
  static async signInUser (user) {
    const url = `${env.BACKEND_URL}/api/signin`
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // mode: 'cors',
      credentials: 'include', // Don't forget to specify this if you need cookies
      body: JSON.stringify(user)
    })
  }

  // Needs updating
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

    return response
  }

  static async fetchRefreshTokens (user) {
    // user.rfs =
    //   'pQ3Nbr2wGO2eZngU89aiTKZbFn1EhmuOzUypy2eU2vF7JO6gkDM8FMk3AYq591gi90Ou3rNlciv01wuKlt5TKUEgR7LCF84Oalsn592kCbKYeJwsBxDxYpaaB6gSFl7IE2pQ0IID8v3Yt6tiU7nXGlkacM0WZRjHQoTpMvyBbdaWwUfSrdaGvRXAobX7FOacitrvTgZ0GzFyqI4rIJZRYfvyhVp8ScP0Ur7Q3BmozOF96YeuQtMIJ67tTuy2hlvY'
    // Must create FormData when posting an image
    const url = `${env.BACKEND_URL}/api/refresh`
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include' // Don't forget to specify this if you need cookies
    })

    return response
  }

  // is this being used?
  static async fetchRefreshTokensServer (cookies) {
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

  static async updateUser (user) {
    const url = `${env.BACKEND_URL}/api/account`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Don't forget to specify this if you need cookies
      body: JSON.stringify(user)
    })

    return response
  }

  static async forgotUser (email) {
    const url = `${env.BACKEND_URL}/api/account/forgot`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Don't forget to specify this if you need cookies
      body: JSON.stringify(email)
    })

    return response
  }

  static async resetPassword (passwordToken) {
    const url = `${env.BACKEND_URL}/api/account/reset`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Don't forget to specify this if you need cookies
      body: JSON.stringify(passwordToken)
    })

    return response
  }
}

export default authApi
