/* eslint-disable no-unused-vars */
import env from '../config/envConfig'
import fetch from 'isomorphic-unfetch'
import FormData from 'form-data'
import { fetchIntercepter } from './fetchWrapper'
import { convertToFormData } from '../utils/storeHelpers'

const handleStatusCheck = response => {
  console.log('handleStatusCheck')
  console.log(response)

  const error = {
    message: 'There was an error',
    logout: false
  }
  if (response.status === 401) {
    error.message = 'User not Authroized'
    error.logout = true

    throw error
  }

  if (response.status !== 200) {
    error.message = response.statusText
    throw error
  }
}

const resolvePromiseError = (promise, reject) => {
  promise.then(res => reject(res.message))
}

class StoreApi {
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

  static async getSingleStore (slug) {
    const url = `${env.BACKEND_URL}/api/store/${slug}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // status check must be above BODY variable
    // handleStatusCheck(response)

    // // Resolve here to return the array below instead of store[]
    // const body = await response.json()
    // console.log('body from getSingStore')
    // console.log(body)

    // return body.store
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
