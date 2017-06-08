import React, { Component } from 'react'
// import { bindActionCreators } from 'redux'
// import * as actions from '../../actions/formSubmitActions'
import { initStore } from '../../store'
import withRedux from 'next-redux-wrapper'
import standardLayout from '../../hocs/standardLayout'
import LoginForm from '../../components/auth/loginForm'
import ForgotPasswordForm from '../../components/auth/forgotPasswordForm'
import { toastr } from 'react-redux-toastr'

const pageTitle = 'Login'

export class LogInPage extends Component {
  static async getInitialProps ({ store, res, query }) {
    return { query }
  }
  componentDidMount () {
    if (this.props.query.error) {
      toastr.error('Error:', 'Password reset is invalid or has expired')
    }
  }
  render () {
    return (
      <div className='inner' style={{ paddingTop: 30 }}>
        <LoginForm />
        <ForgotPasswordForm />
      </div>
    )
  }
}

export default withRedux(initStore)(standardLayout(LogInPage, pageTitle))
