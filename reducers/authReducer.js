import actionTypes from '../actions/actionTypes'
import initialState from './initialState'

export const authReducer = (state = initialState.user, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_LOGIN:
      return Object.assign({}, state, {
        isAuthenticated: !state.isAuthenticated
      })
    case actionTypes.GET_USER_HEARTS:
      return {
        ...state,
        hearts: action.data
      }
    case actionTypes.SAVE_USER:
      return Object.assign({}, state, {
        ...action.user,
        isAuthenticated: true
      })
    case actionTypes.HEART_TOGGLE:
      return {
        ...state,
        hearts: action.data
      }
    case actionTypes.REFRESH_TOKEN:
      return Object.assign({}, state, {
        ...action.user,
        isAuthenticated: true
      })
    case actionTypes.LOG_OUT:
      return {
        isAuthenticated: false
      }
    default:
      return state
  }
}
