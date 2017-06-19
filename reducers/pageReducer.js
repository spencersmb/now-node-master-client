import actionTypes from '../actions/actionTypes'
// import initialState from './initialState'
import { createPaginator } from '../actions/paginator'
// Data shape - RECIEVE STORE PAGE
// pagination: {
//     pages: {
//       1: {
//         ids: [ 'todo1', 'todo2' ],
//         fetching: false
//       },
//     }
// }

export const pagination = createPaginator('/stores', 'stores')

export const pages = (pages = {}, action = {}) => {
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

// Default to page 1
export const currentPage = (currentPage = 1, action = {}) =>
  (action.type === actionTypes.REQUEST_STORE_PAGE
    ? action.payload.page
    : currentPage)
