import React from 'react'
import { connect } from 'react-redux'
import StoreCard from './storeCard'

class storesList extends React.Component {
  renderStores () {
    const { stores, filteredStores, user, favs } = this.props
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

    return stores.map(store => (
      <StoreCard key={store._id} user={user} {...store} />
    ))
  }

  render () {
    return (
      <div className='inner stores'>
        {this.renderStores()}
      </div>
    )
  }
}

// const mapStateToProps = ({ stores }) => ({ stores })
const mapStateToProps = state => {
  return {
    stores: state.stores,
    user: state.user
  }
}

export default connect(mapStateToProps)(storesList)
