import actionTypes from './actionTypes'

export const requestPage = (endpoint, resultKey, page) => {
  console.log('requst page builder')
  return {
    type: actionTypes.REQUEST_PAGE,
    payload: {
      page
    },
    meta: {
      endpoint,
      resultKey
    }
  }
}

export const receivePage = (resultKey, page, results) => ({
  type: actionTypes.RECEIVE_PAGE,
  payload: {
    page,
    results
  },
  meta: {
    resultKey
  }
})

// const requestTodoPage = createRequestPageActionCreator('/todos/', 'todos')
const createRequestPageActionCreator = (endpoint, resultKey) => page => {
  console.log('createRequestPageActionCreator')

  return requestPage(endpoint, resultKey, page)
}

const createRecievePageActionCreator = resultKey => (page, results) => {
  console.log('createRequestPageActionCreator')

  return receivePage(resultKey, page, results)
}

export const requestStorePage = createRequestPageActionCreator(
  '/stores/',
  'stores'
)

export const receiveStorePage = createRecievePageActionCreator('stores')
