import initialState from './initialState'
export const timeReducer = (state = initialState.time, action) => {
  switch (action.type) {
    case 'TICK':
      console.log('tick')
      console.log(action.tokenTime)

      return Object.assign({}, state, action.tokenTime)
    default:
      return state
  }
}
