import moment from 'moment'
import envConfig from '../config/envConfig'

export const getNewTokenTime = user => {
  const currentTime = moment().unix()
  const refreshWindow = envConfig.REFRESH_WINDOW // min
  const expired = user.exp < currentTime // because time goes up
  const duration = user.exp - currentTime
  const timeLeft = moment.duration(duration, 'seconds')
  const minLeft = moment.duration(timeLeft).minutes()
  const secCount = moment
    .duration(timeLeft.asSeconds() - 1, 'seconds')
    .seconds()
  const readyForRefresh = minLeft < refreshWindow && secCount >= 0
  return {
    exp: user.exp,
    refreshWindow: refreshWindow,
    isExpired: expired,
    minLeft: minLeft,
    secLeft: secCount,
    refresh: readyForRefresh
  }
}
