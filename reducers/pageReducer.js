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
