import React from 'react'
import { connect } from 'react-redux'
import StoreCard from './storeCard'

class storesList extends React.Component {
  renderStores () {
    const { stores, filteredStores, user, favs, pagination } = this.props
    const currentPage = pagination.currentPage
    const pages = pagination.pages.stores

    if (favs === 'true') {
      return stores
        .filter(store => {
          if (user.hearts.includes(store._id)) {
            return store
          }
        })
        .map(store => <StoreCard key={store._id} user={user} {...store} />)
    }

    if (filteredStores) {
      return filteredStores.map(store => (
        <StoreCard key={store._id} user={user} {...store} />
      ))
    }

    return pages[currentPage].ids.map(storeId => {
      return (
        <StoreCard key={stores[storeId]._id} user={user} {...stores[storeId]} />
      )
    })
  }

  render () {
    return (
      <div className='inner'>
        <div className='stores'>{this.renderStores()}</div>
      </div>
    )
  }
}

// const mapStateToProps = ({ stores }) => ({ stores })
const mapStateToProps = state => {
  return {
    pagination: state.pagination,
    stores: state.stores.data,
    user: state.user
  }
}

export default connect(mapStateToProps)(storesList)
