import React from 'react'
import { initStore } from '../store'
// import { bindActionCreators } from 'redux'
import withRedux from 'next-redux-wrapper'
import standardLayout from '../hocs/standardLayout'
import StoresList from '../components/stores/storesList'
import { getStores } from '../actions/storesActions'
// import { requestStorePage, receiveStorePage } from '../actions/pagination'
import { pagination } from '../reducers/pageReducer'

const pageTitle = 'Our Store'

class StoresPage extends React.Component {
  static async getInitialProps ({ store, res, query }) {
    // await this.props.dispatch(getStores())
    const page = 1
    // store.dispatch(requestStorePage(page))

    store.dispatch(pagination.requestPage('/stores', 'stores', page))
    const response = await store.dispatch(getStores())
    store.dispatch(pagination.receivePage('stores', page, response.stores))

    return {}
  }

  render () {
    return (
      <div>
        <h2 className='inner'>Stores</h2>
        <StoresList />
      </div>
    )
  }
}

export default withRedux(initStore)(standardLayout(StoresPage, pageTitle))
