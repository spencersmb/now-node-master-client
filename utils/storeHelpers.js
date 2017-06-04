import _ from 'lodash'
import FormData from 'form-data'

/**
 * getStoreById(array, ID)
 *
 * @param [Array] stores
 * @param number ID
 * @returns [Array]
 */
export const getStoreById = (stores, storeId) => {
  if (stores.length > 0) {
    return stores.filter(store => store._id === storeId)
  }
}

/**
 * convertTagsToObject(arg)
 * - Convert array from MongoDb to Object Key/value pair for Redux-Form Initialization
 *
 * @param {Object} store
 * @returns {Object} empty
 * @returns {Object} tags key/value pair {"TagName": true, "TagName": true}
 */
export const convertTagsToObject = store => {
  if (store === undefined) {
    return {}
  }

  const storeObj = store[0]
  const oldTagsArray = storeObj.tags

  const tagObject = {}
  oldTagsArray.forEach(tag => {
    const obj = {}
    obj[tag] = true
    _.merge(tagObject, obj)
  })
  return Object.assign({}, storeObj, {
    tags: tagObject
  })
}

/**
 * convertTagsToArray(arg)
 * - Convert Object coming from Redux-Form and convert object to array and store on key "tags" to send to Mongo
 *
 * @param {Object} store
 * @returns {Object} store(original)
 * @returns {Object} Object with new array stored on key "tags"
 */
export const convertTagsToArray = store => {
  // Check if store already has tags array
  if (!store.hasOwnProperty('tags')) {
    return store
  }

  const tags = Object.keys(store.tags)

  // Convert tags to array and store inside tags object
  return Object.assign({}, store, { tags: tags })
}

/**
 * convertToFormData(arg)
 * - Get store object before sending to API and create a new FormData Object to send to server
 * - Used to upload files/photos
 *
 * @param {Object} store
 * @returns {Object} store(original)
 * @returns {Object} Object with new array stored on key "tags"
 */
export const convertToFormData = store => {
  const formData = new FormData()

  for (const key in store) {
    switch (true) {
      // check that the key is not a string incase user already has a photo - dont update it
      case key === 'photo' && typeof store[key] !== 'string':
        formData.append(key, store[key][0])
        break

      case key === 'tags' && store['tags'].length > 0:
        store.tags.forEach(tag => {
          formData.append(key, tag)
        })
        break

      default:
        formData.append(key, store[key])
    }
  }

  return formData
}

/**
 * renderSvg(svg)
 * - Component Helper to render and svg item
 *
 * @param {Object} svg - from importing an svg into react
 */
export const renderSvg = Svg => <Svg />
