/* eslint-disable no-unused-vars */
import env from '../config/envConfig'
import fetch from 'isomorphic-unfetch'
import FormData from 'form-data'
import { fetchIntercepter } from './fetchWrapper'
import { convertToFormData } from '../utils/storeHelpers'

const resolvePromiseError = (promise, reject) => {
  promise.then(res => reject(res.message))
}

class StoreApi {
  // convert this
  static async getTagList (tag) {
    const url = `${env.BACKEND_URL}/api/tags/${tag}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Resolve here to return the array below instead of store[]
    const body = await response.json()

    if (response.status !== 200) {
      const error = {
        message: 'Could not find tags'
      }

      throw error.message
    }
    /* Data sent down is 2 arrays [
      [tags],
      [stores]
     ]
     */
    return body
  }
  static async addRating (rating) {
    const url = `${env.BACKEND_URL}/api/reviews/`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rating),
      credentials: 'include' // Don't forget to specify this if you need cookies
    })
    return response
  }
  static async getFavoriteStores (cookies = null) {
    const url = `${env.BACKEND_URL}/api/stores/fav`

    if (!cookies) {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include' // Don't forget to specify this if you need cookies
      })
      return response
    }
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        cookie: cookies
      }
    })
    return response
  }

  static async heartStore (id) {
    const url = `${env.BACKEND_URL}/api/stores/${id}/heart`
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include' // Don't forget to specify this if you need cookies
    })
    return response
  }

  static async getSingleStore (slug) {
    const url = `${env.BACKEND_URL}/api/store/${slug}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  }

  static getStores () {
    return new Promise((resolve, reject) => {
      const url = `${env.BACKEND_URL}/api/stores`

      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(r => r.json())
        .then(res => {
          resolve(res.stores)
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  static async addStore (newStore, reduxStore) {
    // Must create FormData when posting an image
    const formData = convertToFormData(newStore)

    const url = `${env.BACKEND_URL}/api/add`
    const response = await fetchIntercepter(
      url,
      {
        method: 'POST',
        credentials: 'include', // Don't forget to specify this if you need cookies
        body: formData
      },
      reduxStore
    )

    // handleStatusCheck(response)

    // Resolve here to return the array below instead of store[]
    // const body = await response.json()

    console.log('datafrom ADD API CALL', response)

    return response.data
  }

  /* Model for API calls */
  static async addStoreFetch (newStore) {
    // Create FormData when posting an image
    const formData = convertToFormData(newStore)

    const url = `${env.BACKEND_URL}/api/add`
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include', // Don't forget to specify this if you need cookies
      body: formData
    })

    // Send PROMISE TO ACTION TO SEND THROUGH REDUCER
    return response
  }

  static updateStore (store) {
    const formData = convertToFormData(store)

    // const token = getTokenFromLocalStorage()
    return new Promise((resolve, reject) => {
      fetch(`${env.BACKEND_URL}/api/update`, {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json'
        //   // Authorization: `Bearer ${token}`
        // },
        body: formData
      })
        .then(r => {
          let res = r.json()

          // check for error message
          if (r.status !== 200) {
            resolvePromiseError(res, reject)
          }

          return res
        })
        .then(res => {
          resolve(res)
        })
        .catch(e => {
          reject(e)
        })
    })
  }
}

export default StoreApi
