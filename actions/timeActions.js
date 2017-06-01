import { getNewTokenTime } from '../utils/timeHelpers'

export const startClock = user => dispatch => {
  return setInterval(() => dispatch(tokenTick(user)), 1000)
}

export const tokenTick = user => {
  const tokenTime = getNewTokenTime(user)
  return { type: 'TICK', tokenTime }
}
