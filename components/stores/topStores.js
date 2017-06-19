// @flow
import React from 'react'
import { connect } from 'react-redux'
import TopStoreCard from './topStores-card'
import type { Store } from '../../flowTypes/Store'
import type { User } from '../../flowTypes/User'

type Props = {
  stores: Store[],
  user: User
}

class topStoresList extends React.Component<void, Props, void> {
  renderStores () {
    if (this.props.stores) {
      return this.props.stores.map((store, index) => (
        <TopStoreCard key={store._id} index={index} {...store} />
      ))
    }
  }
  render () {
    console.log('top stores list', this.props)

    return (
      <div className='inner'>
        <table className='table'>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Ranking</th>
              <th>Name</th>
              <th>Reviews</th>
              <th>Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {this.renderStores()}
          </tbody>

        </table>
      </div>
    )
  }
}

// const mapStateToProps = ({ stores }) => ({ stores })
const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(topStoresList)
