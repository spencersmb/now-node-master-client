import { connect } from 'react-redux'
import React from 'react'
import { bindActionCreators } from 'redux'
import Link from 'next/link'
import { renderSvg } from '../../utils/storeHelpers'
import { svgs } from '../../config/svgs'
import { logUserOut } from '../../actions/authActions'
import { toastr } from 'react-redux-toastr'
import Router from 'next/router'

class isSignedIn extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.handleLogOut = this.handleLogOut.bind(this)
  }
  async handleLogOut () {
    try {
      await this.props.logOut()
      Router.push(`/auth/logout`, `/logout`)
      toastr.success('Logout', 'Successfully Logged Out')
    } catch (e) {}
  }
  render () {
    const { user } = this.props
    if (user.isAuthenticated) {
      return (
        <div className='nav__section nav__section--user'>
          <li className='nav__item'>
            <Link href='/hearts'>
              <a className='nav__link'>
                {renderSvg(svgs.Heart)}
                {user.hearts.length ? user.hearts.length : ''}
              </a>
            </Link>
          </li>
          <li className='nav__item'>
            <Link href='/auth/account' as='/account'>
              <img
                src={
                  user.gravatar
                    ? user.gravatar
                    : '/static/images/photos/default.jpg'
                }
                alt=''
                className='avatar'
              />
            </Link>
          </li>
          <li className='nav__item' onClick={this.handleLogOut}>
            <a className='nav__link'>
              {renderSvg(svgs.Logout)}
              Log Out
            </a>
          </li>
        </div>
      )
    } else {
      return (
        <div className='nav__section nav__section--user'>
          <li className='nav__item'>
            <Link href='/auth/register' as='/register'>
              <a className='nav__link'>Register</a>
            </Link>

          </li>
          <li className='nav__item'>
            <Link href='/auth/login' as='/login'>
              <a className='nav__link'>Log In</a>
            </Link>
          </li>
        </div>
      )
    }
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user
  }
}
const mapDispatchToProps = dispatch => {
  return {
    logOut: bindActionCreators(logUserOut, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(isSignedIn)
