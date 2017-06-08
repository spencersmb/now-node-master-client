import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { storeReducer } from './reducers/storeReducer'
import { reducer as formReducer } from 'redux-form'
import { authReducer } from './reducers/authReducer'
import { timeReducer } from './reducers/timeReducer'
import { reducer as toastrReducer } from 'react-redux-toastr'
import { editStoreReducer } from './reducers/editStoreReducer'
import { editAccountReducer } from './reducers/editAccountReducer'
import { tagsReducer } from './reducers/tagsReducer'
import apiIntercepter from './middleware/apiIntercepter'

export const initStore = (initialState = {}) => {
  // mirror of state from original app
  const reducers = combineReducers({
    user: authReducer,
    stores: storeReducer,
    form: formReducer,
    editingStore: editStoreReducer,
    userAccount: editAccountReducer,
    filtered: tagsReducer,
    toastr: toastrReducer,
    time: timeReducer
  })

  let env = process.env.NODE_ENV || 'development'

  if (typeof window !== 'undefined' && env === 'development') {
    return createStore(
      reducers,
      initialState,
      composeWithDevTools(applyMiddleware(thunkMiddleware, apiIntercepter))
    )
  }

  return createStore(
    reducers,
    initialState,
    applyMiddleware(thunkMiddleware, apiIntercepter)
  )
}
