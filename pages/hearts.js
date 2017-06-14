import React from 'react'
import { initStore } from '../store'
// import { bindActionCreators } from 'redux'
import withRedux from 'next-redux-wrapper'
import secureLayout from '../hocs/secureLayout'
import StoresList from '../components/stores/storesList'
import { getFavoriteStores, getStores } from '../actions/storesActions'
import { findCookies } from '../utils/authUtils'

const pageTitle = 'Favs'

class Favorites extends React.Component {
  static async getInitialProps (ctx) {
    // await this.props.dispatch(getStores())
    // await store.dispatch(getStores())
    const headers = ctx.res ? ctx.res._headers : undefined
    try {
      // const stores = await ctx.store.dispatch(
      //   getFavoriteStores(findCookies(headers, ctx.req))
      // )
      const stores = await ctx.store.dispatch(getStores())
      return { stores }
    } catch (e) {
      console.log('error in hearts.js', e)
      return {}
    }
  }

  render () {
    const { stores, user } = this.props
    return (
      <div>
        <h2 className='inner'>Favorite Stores</h2>
        <StoresList user={user} favs='true' />
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
  secureLayout(Favorites, pageTitle)
)
