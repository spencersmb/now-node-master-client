import React, { Component } from 'react'
import { initStore } from '../../store'
import withRedux from 'next-redux-wrapper'
import standardLayout from '../../hocs/standardLayout'
import { toastr } from 'react-redux-toastr'

const pageTitle = 'Confirm Registration'

export class ConfirmRegistration extends Component {
  static async getInitialProps ({ store, res, query }) {
    return { query }
  }
  componentDidMount () {
    if (this.props.query.error) {
      toastr.error(
        'Error:',
        'Request is invalid or has expired. Please try again'
      )
    }
  }
  render () {
    return (
      <div className='inner' style={{ paddingTop: 30 }}>
        <h2>Thank You for Signing Up</h2>
        <p>
          You will recieve an email with instructions about how to confirm your account shortly.
        </p>
      </div>
    )
  }
}

export default withRedux(initStore)(
  standardLayout(ConfirmRegistration, pageTitle)
)
