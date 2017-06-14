import React from 'react'
import Router from 'next/router'
import Header from '../components/Header'
import { connect } from 'react-redux'
import Head from 'next/head'
import { envConfig } from '../config/envConfigServer'
import ReduxToastr from 'react-redux-toastr'
import {
  getUserFromJWT,
  findTokenToDecode,
  validateUserTokenServer,
  validateUserTokenClient,
  findCookies
} from '../utils/authUtils'
import { getStores } from '../actions/storesActions'

export default (Page, title = '') => {
  class standardLayout extends React.Component {
    static async getInitialProps (ctx) {
      /**
       * Server-side - check for user passed in from custom express server => populate redux if user is found
       *
       * On client-side check && validate user on each page load: expiry and refresh checks with Refresh Window Time
       */
      process.browser
        ? await validateUserTokenClient(ctx.store, ctx.store.getState().user)
        : await validateUserTokenServer(
            ctx.store,
            getUserFromJWT(findTokenToDecode(ctx.res._headers, ctx.req)),
            findCookies(ctx.res._headers, ctx.req)
          )

      // Get stores on Server-side render for first page load
      // process.browser ? '' : await ctx.store.dispatch(getStores())

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
    }

    componentWillUnmount () {
      window.removeEventListener('storage', this.logout, false)
    }

    render () {
      return (
        <div>
          <Head>
            <title>{title} | {envConfig.WEBSITE_TITLE}</title>
          </Head>
          <Header {...this.props} />
          <ReduxToastr
            timeOut={6000}
            newestOnTop={false}
            preventDuplicates
            position='bottom-right'
            transitionIn='fadeIn'
            transitionOut='fadeOut'
            progressBar={false}
          />
          <Page {...this.props} />

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
