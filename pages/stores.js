import React from 'react'
import { initStore } from '../store'
import withRedux from 'next-redux-wrapper'
import standardLayout from '../hocs/standardLayout'
import StoresList from '../components/stores/storesList'
import { getStores } from '../actions/storesActions'
import { pagination } from '../reducers/pageReducer'
import Pagination from '../components/nav/pagination'

const pageTitle = 'Our Store'

class StoresPage extends React.Component {
  static async getInitialProps (ctx) {
    const page = ctx.query.pageId ? ctx.query.pageId : 1

    /*
    PAGINATION:
    - Dispatch page request and set loading to true
    - Get stores + page count - does not use redux middlewear method(errors)
    - set redux with pagination Data
    */
    ctx.store.dispatch(pagination.requestPage('/stores', 'stores', page))
    const response = await ctx.store.dispatch(getStores(page))
    ctx.store.dispatch(
      pagination.receivePage('stores', page, response.data.stores)
    )

    return {}
  }

  render () {
    return (
      <div className='inner'>
        <h2>Stores</h2>
        <StoresList />
        <Pagination />
      </div>
    )
  }
}

export default withRedux(initStore)(standardLayout(StoresPage, pageTitle))
