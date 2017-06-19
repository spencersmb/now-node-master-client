// @flow

import React from 'react'
import { initStore } from '../store'
import withRedux from 'next-redux-wrapper'
import secureLayout from '../hocs/secureLayout'
import { getTopStores } from '../actions/storesActions'
import { findCookies } from '../utils/authUtils'
import TopStoresList from '../components/stores/topStores'
import type { User } from '../flowTypes/User'
import type { Store } from '../flowTypes/Store'

const pageTitle = 'Our Store'

type Props = {
  url: any,
  isAuthenticated: boolean,
  dispatch: Function,
  currentUrl?: string,
  user: User,
  stores?: Store[]
}

class TopStores extends React.Component<void, Props, void> {
  user: User

  static async getInitialProps (ctx) {
    const headers = ctx.res ? ctx.res._headers : undefined
    try {
      const stores = await ctx.store.dispatch(
        getTopStores(findCookies(headers, ctx.req))
      )
      return { stores }
    } catch (e) {
      console.log('catch error top.js', e)
    }
  }

  constructor (props: Props) {
    super(props)
    this.user = this.props.user
  }

  render () {
    const { stores } = this.props
    return (
      <div className='inner'>
        <h2> Top {stores ? stores.length : ''} Stores</h2>
        <TopStoresList stores={this.props.stores} />
      </div>
    )
  }
}

const mapStateToProps = ({ user }) => ({ user })

export default withRedux(initStore, mapStateToProps)(
  secureLayout(TopStores, pageTitle)
)
