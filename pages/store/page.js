import React from 'react'
import { initStore } from '../../store'
// import { bindActionCreators } from 'redux'
import withRedux from 'next-redux-wrapper'
import standardLayout from '../../hocs/standardLayout'
import StoresList from '../../components/stores/storesList'
import { getStores } from '../../actions/storesActions'
// import { requestStorePage, receiveStorePage } from '../actions/pagination'
import { pagination } from '../../reducers/pageReducer'

const pageTitle = 'Our Store'

class StoresPage extends React.Component {
  static async getInitialProps (ctx) {
    // await this.props.dispatch(getStores())
    const page = ctx.query.pageId ? ctx.query.pageId : 1
    // store.dispatch(requestStorePage(page))

    ctx.store.dispatch(pagination.requestPage('/stores', 'stores', page))
    const response = await ctx.store.dispatch(getStores(page))
    console.log('page', ctx.query.pageId)

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
      </div>
    )
  }
}

export default withRedux(initStore)(standardLayout(StoresPage, pageTitle))
