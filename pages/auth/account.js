import React from 'react'
import { initStore } from '../../store'
import withRedux from 'next-redux-wrapper'
import secureLayout from '../../hocs/secureLayout'
import AccountForm from '../../components/auth/accountForm'
const pageTitle = 'My Account'

class Account extends React.Component {
  static async getInitialProps ({ store, res, query }) {
    // const user = store.getState().user
    return {}
  }

  async componentDidMount () {}

  render () {
    console.log(this.props.user)

    return (
      <div className='inner'>
        <AccountForm selectedUser={this.props.user} />
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
  secureLayout(Account, pageTitle)
)
