import actionTypes from '../actions/actionTypes'
import initialState from './initialState'

export const editAccountReducer = (
  state = initialState.userAccount,
  action
) => {
  switch (action.type) {
    case actionTypes.LOAD_USER_DATA:
      return Object.assign({}, state, {
        data: action.user
      })
    default:
      return state
  }
}
