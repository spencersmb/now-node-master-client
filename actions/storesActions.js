import actionTypes from './actionTypes'
import StoreApi from '../api/storesApi'

export const getTagsList = tag => async (dispatch, getState) => {
  try {
    const data = await StoreApi.getTagList(tag)
    dispatch(loadTagListSuccess(data))
    return data
  } catch (e) {
    throw e
  }
}

export const addRating = rating => dispatch => {
  const request = StoreApi.addRating(rating)

  return dispatch({
    type: actionTypes.ADD_RATING,
    payload: request
  })
}

export const addRatingToStore = (storeId, rating) => dispatch => {
  return dispatch({
    type: actionTypes.ADD_RATING_STORE,
    payload: { storeId, rating }
  })
}

export const getFavoriteStores = cookies => dispatch => {
  const request = StoreApi.getFavoriteStores(cookies)

  return dispatch({
    type: actionTypes.GET_FAV_STORES,
    payload: request
  })
}

export const getSingleStore = slug => async (dispatch, getState) => {
  console.log('get single store')

  const request = StoreApi.getSingleStore(slug)

  return dispatch({
    type: actionTypes.GET_SINGLE_STORE,
    payload: request // request = Promise, must send data on key 'payload`
  })
  // let state = getState()

  // // if nothing is there make api call and then return single store
  // if (state.stores.length === 0) {
  //   try {
  //     const store = await StoreApi.getSingleStore(slug)
  //     dispatch(loadSingleStoreSuccess(store))
  //     return store[0]
  //   } catch (e) {
  //     // handleError(e, dispatch)
  //     throw e
  //   }
  // }

  // console.log('slug')
  // console.log(slug)
  // console.log('state from getSinglestore')
  // console.log(state.stores)
  // console.log(state.stores.filter(store => store.slug === slug))

  // // return first item from the array that is filtered
  // return state.stores.filter(store => store.slug === slug)[0]
}

export const getStores = () => (dispatch, getState) => {
  const state = getState()

  if (state.stores.length > 1) {
    console.log('stores cached')
    dispatch(loadStoresSuccess(state.stores))
    return
  }

  return StoreApi.getStores()
    .then(stores => {
      dispatch(loadStoresSuccess(stores))
    })
    .catch(e => {})
}

export const addStore = store => dispatch => {
  return StoreApi.addStore(store, dispatch)
    .then(res => {
      /*
        On sucess dispatch call and redirect
      */
      // toastr.success('Saved', 'Store Saved Successfully!')
      // Router.push(`/store?params=${res.slug}`, `/store/${res.slug}`)

      dispatch(saveStore(res))

      return res
    })
    .catch(err => {
      // SET 1
      // toastr.error('Error:', err)

      // SET 2
      throw err
    })
}

export const heartAction = id => dispatch => {
  const request = StoreApi.heartStore(id)

  return dispatch({
    type: actionTypes.HEART_TOGGLE,
    payload: request
  })
}

/* Model for Async Actions to go through middleware */
export const addStoreGriderAction = store => dispatch => {
  const request = StoreApi.addStoreFetch(store)

  return dispatch({
    type: actionTypes.ADD_STORE,
    payload: request // request = Promise, must send data on key 'payload`
  })
}

export const updateStore = store => dispatch => {
  return StoreApi.updateStore(store)
    .then(res => {
      /*
        On sucess dispatch call
      */
      dispatch(updateStoreSuccess(res))
      return res
    })
    .catch(err => {
      // SET 1
      // toastr.error('Error:', err)

      // SET 2
      throw err
    })
}

export const loadTagListSuccess = data => {
  return {
    type: actionTypes.LOAD_TAG_LIST_SUCCESS,
    data
  }
}

export const saveStore = store => dispatch => {
  return dispatch({
    type: actionTypes.SAVE_STORE,
    store
  })
}

export const updateStoreSuccess = store => {
  return {
    type: actionTypes.UPDATE_STORE_DATA,
    store
  }
}

export const loadStoresSuccess = stores => {
  return {
    type: actionTypes.LOAD_STORES_SUCCESS,
    stores
  }
}

export const loadSingleStoreSuccess = store => {
  return {
    type: actionTypes.LOAD_SINGLE_STORE_SUCCESS,
    store
  }
}

export const loadForm = store => {
  return {
    type: actionTypes.LOAD_STORE_DATA,
    store
  }
}
