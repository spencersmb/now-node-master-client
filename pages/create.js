import React from 'react'
import { initStore } from '../store'
import withRedux from 'next-redux-wrapper'
import secureLayout from '../hocs/secureLayout'
import InitializeFromStateForm from '../components/stores/storeForm'
import { getStores } from '../actions/storesActions'

class editStoreForm extends React.Component {
  static async getInitialProps ({ store, res, query }) {
    console.log('laoded add store page')

    // Get storeID
    await store.dispatch(getStores())
    return { query }
  }

  render () {
    return (
      <div className='inner'>
        <InitializeFromStateForm />
      </div>
    )
  }
}

export default withRedux(initStore, null)(
  secureLayout(editStoreForm, 'Create Store')
)
