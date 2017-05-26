import React from 'react'
import { initStore } from '../store'
import withRedux from 'next-redux-wrapper'
import standardLayout from '../hocs/standardLayout'
import moment from 'moment'

class Counter extends React.Component {
  static getInitialProps ({ store, isServer }) {
    return { isServer }
  }

  componentDidMount () {
    // const exp = moment(timestamp).add(60, 'm').unix() // 60 min
    // const exp = 1495697719 //Old one for testing
    const exp = 1495787570

    const currentTime = moment().unix()
    const refreshWindow = 15 // min
    const expired = exp < currentTime // because time goes up
    const duration = exp - currentTime
    const timeLeft = moment.duration(duration * 1000, 'milliseconds')
    const minLeft = moment.duration(timeLeft).minutes()

    console.log(
      'Current Time',
      moment.unix(currentTime).format('YYYY-MM-DD HH:mm')
    )
    console.log('Expired Time', moment.unix(exp).format('YYYY-MM-DD HH:mm'))
    console.log('has token expired', expired)
    console.log('time left until token expires', minLeft)
    console.log(
      'is token within 15 min of expiring?',
      minLeft <= refreshWindow && minLeft > 0
    )

    // console.log('exp minus currentTime', expMinusCurr)
    // console.log('timeLeft', timeLeft)
    // console.log('timeLeft', moment.unix(timeLeft).format('HH:mm'))
  }

  render () {
    return (
      <div>
        MOMENT TIME
      </div>
    )
  }
}

export default withRedux(initStore)(standardLayout(Counter, 'Other Page Title'))
