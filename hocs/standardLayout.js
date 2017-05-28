import React from 'react'
import Router from 'next/router'
import Header from '../components/Header'
import { connect } from 'react-redux'
import Head from 'next/head'
import env from '../config/envConfig'
import ReduxToastr from 'react-redux-toastr'
import {
  getUserFromJWT,
  getTokenFromCookie,
  getTokenFromCookieRes,
  findTokenToDecode,
  validateUserToken
} from '../utils/authUtils'
import { getStores } from '../actions/storesActions'
import { saveUserToRedux } from '../actions/authActions'
import authApi from '../api/authApi'

export default (Page, title = '') => {
  class standardLayout extends React.Component {
    static async getInitialProps (ctx) {
      /**
       * On first page load server-side - check for user passed in from custom express server => populate redux if user is found
       * On client-side check validate user on each page load: expiry and refresh checks
       */
      process.browser
        ? validateUserToken(
            process.browser,
            ctx.store,
            ctx.store.getState().user
          )
        : ctx.store.dispatch(
            // if undefined - no token was updated - use the current user from the current token
            saveUserToRedux(
              getUserFromJWT(findTokenToDecode(ctx.res._headers, ctx.req))
            )
          )

      const stores = process.browser
        ? ''
        : await ctx.store.dispatch(getStores())

      // send props to the parent > child container
      const pageProps =
        (await Page.getInitialProps) && (await Page.getInitialProps(ctx))

      return {
        ...pageProps,
        currentUrl: ctx.pathname
      }
    }

    constructor (props) {
      super(props)
      this.logout = this.logout.bind(this)
    }

    logout (eve) {
      if (eve.key === 'logout') {
        Router.push(`/auth/login`, `/login`)
      }
    }

    componentDidMount () {
      window.addEventListener('storage', this.logout, false)

      if (!this.props.user.isAuthenticated) {
        // this.props.logOut()
      }
    }

    componentWillUnmount () {
      window.removeEventListener('storage', this.logout, false)
    }

    render () {
      return (
        <div>
          <Head>
            <title>{title} | {env.WEBSITE_TITLE}</title>
          </Head>
          <Header {...this.props} />
          <Page {...this.props} />
          <ReduxToastr
            timeOut={8000}
            newestOnTop={false}
            preventDuplicates
            position='bottom-right'
            transitionIn='fadeIn'
            transitionOut='fadeOut'
            progressBar={false}
          />
        </div>
      )
    }
  }

  const mapStateToProps = (state, ownProps) => {
    return {
      user: state.user
    }
  }

  return connect(mapStateToProps)(standardLayout)
}
