import React from 'react'
import { initStore } from '../store'
import withRedux from 'next-redux-wrapper'
import { bindActionCreators } from 'redux'
import { startClock } from '../actions/timeActions'
import standardLayout from '../hocs/standardLayout'
import moment from 'moment'
import { getNewTokenTime } from '../utils/timeHelpers'
import TokenClock from '../components/auth/tokenClock'

class Counter extends React.Component {
  static getInitialProps (ctx) {
    const user = ctx.store.getState().user
    const tokenTime = getNewTokenTime(user)
    ctx.store.dispatch({ type: 'TICK', tokenTime })

    return { user }
  }

  componentDidMount () {
    if (this.props.user.exp) {
      this.timer = this.props.dispatch(startClock(this.props.user))
    }
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  tick () {
    setInterval(() => {
      const currentTime = moment().unix()
      const duration = this.state.exp - currentTime
      const expired = this.state.exp < currentTime // because time goes up
      const timeLeft = moment.duration(duration, 'seconds')
      // const secLeft = timeLeft.seconds()
      const minLeft = moment.duration(timeLeft).minutes()
      const secCount = moment
        .duration(timeLeft.asSeconds() - 1, 'seconds')
        .seconds()
      const readyForRefresh = minLeft < this.state.refreshWindow && secCount > 0
      this.setState({
        isExpired: expired,
        minLeft: minLeft,
        secLeft: secCount,
        refresh: readyForRefresh
      })
    }, 1000)
  }

  render () {
    return (
      <div className='inner'>
        <style jsx>{`
        .show {
          padding: 15px;
          display: inline-block;
          color: #82FA58;
          font: 50px menlo, monaco, monospace;
          background-color: #000;
        }

        .hide {
          display:none;
        }
      `}</style>
        <h2>Token Time</h2>
        <div className={!this.props.time.exp ? 'show' : 'hide'}>
          No Token Found
        </div>
        <div className={this.props.time.exp ? 'show' : 'hide'}>
          <TokenClock {...this.props} />
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    time: state.time
  }
}

const mapDispatchToProps = dispatch => {
  return {
    startClock: bindActionCreators(startClock, dispatch)
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(
  standardLayout(Counter, 'Other Page Title')
)
