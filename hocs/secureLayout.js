import React from 'react'
import NotAuthorized from '../components/auth/notAuthorized'
import Router from 'next/router'
import standardLayout from './standardLayout'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { logUserOut } from '../actions/authActions'

/*
  On first server-side render the component looks to display the component or blank page until client takes over
  On first render in client and on stateChange this component looks
  if the user should be logged out or not
  */
const securePageHoc = Page => class SecurePage extends React.Component {
  static async getInitialProps (ctx) {
    const state = ctx.store.getState()
    const pageProps =
      (await Page.getInitialProps) && (await Page.getInitialProps(ctx))
    return {
      ...pageProps,
      isAuthenticated: state.user.isAuthenticated
    }
  }

  componentDidMount () {
    if (!this.props.user.isAuthenticated) {
      Router.push(`/auth/login`, `/login`)
    }
  }

  componentWillUpdate (nextProps, nextState) {
    if (!nextProps.user.isAuthenticated) {
      Router.push(`/auth/login`, `/login`)
    }
  }
  // depricated
  // static propTypes = {
  //     isAuthenticated: PropTypes.bool.isRequired
  // }
  render () {
    if (!this.props.isAuthenticated) {
      return null
    }
    return <Page {...this.props} />
  }
}

const mapStateToProps = ({ user }) => ({ user })

// Takes in Page(component) and returns our HOC passing in Page to the 2nd HOC
export default Page =>
  connect(mapStateToProps)(standardLayout(securePageHoc(Page)))
