import actionTypes from './actionTypes'
import { combineReducers } from 'redux'

export const createPaginator = (endpoint, resultKey) => {
  // action
  const requestPage = (endpoint, resultKey, page) => {
    return {
      type: actionTypes.REQUEST_PAGE,
      payload: {
        page
      },
      meta: {
        endpoint,
        resultKey
      }
    }
  }

  // action
  const receivePage = (resultKey, page, results) => {
    return {
      type: actionTypes.RECEIVE_PAGE,
      payload: {
        page,
        results
      },
      meta: {
        resultKey
      }
    }
  }

  // Reducer
  const pages = (pages = {}, action = {}) => {
    switch (action.type) {
      case actionTypes.REQUEST_PAGE:
        return {
          ...pages,
          [action.meta.resultKey]: {
            [action.payload.page]: {
              ids: [],
              fetching: true
            }
          }
        }
      case actionTypes.RECEIVE_PAGE:
        return {
          ...pages,
          [action.meta.resultKey]: {
            [action.payload.page]: {
              ids: action.payload.results.map(store => store._id),
              fetching: false
            }
          }
        }
      default:
        return pages
    }
  }

  // Reducer
  const currentPage = (currentPage = 1, action = {}) =>
    (action.type === actionTypes.REQUEST_PAGE
      ? action.payload.page
      : currentPage)

  const onlyForEndpoint = reducer => (state = {}, action = {}) => {
    if (typeof action.meta === 'undefined') {
      return state
    }
    if (action.meta.endpoint === endpoint) {
      return reducer(state, action)
    }

    if (action.meta.resultKey === resultKey) {
      return reducer(state, action)
    }

    return state

    // (typeof action.meta === 'undefined'
    //   ? state
    //   : action.meta.endpoint === endpoint ? reducer(state, action) : state)
  }

  const itemsReducer = (items = {}, action = {}) => {
    switch (action.type) {
      case actionTypes.RECEIVE_PAGE:
        let _items = {}
        for (let item of action.payload.results) {
          _items = {
            ..._items,
            [item._id]: item
          }
        }
        return {
          ...items,
          ..._items
        }
      default:
        return items
    }
  }

  const reducer = onlyForEndpoint(
    combineReducers({
      pages,
      currentPage
    })
  )

  return {
    requestPage,
    receivePage,
    reducer,
    itemsReducer: onlyForEndpoint(itemsReducer)
  }
}
