import React from 'react'
import { initStore } from '../../store'
import withRedux from 'next-redux-wrapper'
import standardLayout from '../../hocs/standardLayout'
import PasswordResetForm from '../../components/auth/passwordResetForm'
const pageTitle = 'Reset Password'

class PasswordReset extends React.Component {
  static async getInitialProps ({ store, res, query }) {
    // const user = store.getState().user
    return { query }
  }

  componentWillMount () {}

  async componentDidMount () {}

  render () {
    return (
      <div className='inner' style={{ paddingTop: 30 }}>
        <PasswordResetForm token={this.props.query.token} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user
  }
}

export default withRedux(initStore, mapStateToProps)(
  standardLayout(PasswordReset, pageTitle)
)
