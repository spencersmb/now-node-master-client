import React from 'react'
import { initStore } from '../../store'
import withRedux from 'next-redux-wrapper'
import standardLayout from '../../hocs/standardLayout'
import StoresList from '../../components/stores/storesList'
import { getStores } from '../../actions/storesActions'
import { pagination } from '../../reducers/pageReducer'
import Pagination from '../../components/nav/pagination'
import { toastr } from 'react-redux-toastr'
import Router from 'next/router'

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

    const stores = response.data.stores
    const count = response.data.count

    return { stores, count }
  }

  componentDidMount () {
    // console.log('CDM', window)
    window.addEventListener('resize', function (e) {
      console.log('e', e)
    })
    if (!this.props.stores || this.props.stores.length === 0) {
      const lastPage = parseInt(this.props.count) / 6
      Router.push(`/store/page?pageId=${lastPage}`, `/store/page/${lastPage}`)
      toastr.error('Bad Request', 'Page does not exist')
    }
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
