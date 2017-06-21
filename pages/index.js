import React from 'react'
import { bindActionCreators } from 'redux'
import { initStore } from '../store'
import { getTodos } from '../actions/todoActions'
import withRedux from 'next-redux-wrapper'
import styled, { css } from 'styled-components'
import standardLayout from '../hocs/standardLayout'
import StoresList from '../components/stores/storesList'
import { getStores } from '../actions/storesActions'
import { pagination } from '../reducers/pageReducer'
import Pagination from '../components/nav/pagination'
// const rule1 = {
//   backgroundColor: 'blue',
//   '@media screen and (min-width: 250px)': {
//     backgroundColor: 'red',
//   },
// }
// const Comp = styled.div`
//     ${rule1}
//     `
const Title = styled.h1`
  color: red;
  font-size: 50px;

  > a{
    font-size:18px;
  }
`

const sizes = {
  phone: 378,
  tablet: 768,
  desktop: 992,
  giant: 1170
}

const media = Object.keys(sizes).reduce((finalMedia, size) => {
  return {
    ...finalMedia,
    [size]: function (...args) {
      return css`
        @media(max-width: ${sizes[size]}px) {
          ${css(...args)}
        }
      `
    }
  }
}, {})

const Div = styled.div`
  padding-left: 20px;

  ${media.tablet`
    padding-left: 30px;
  `}
  
`
//
// const Title = styled.h1`
//   ${{ color: "red", fontSize: "50px", fontFamily: "Open Sans", "> a": { fontSize: "18px" } }}`

const pageTitle = 'Our Store'

class Counterfirst extends React.Component {
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
        <Div>
          <Title>My first Isomorphic App</Title>
        </Div>

        <StoresList />
        <Pagination />
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getTodos: bindActionCreators(getTodos, dispatch)
  }
}

// const mapStateToProps = ({ user }) => ({ user })

export default withRedux(initStore, null, mapDispatchToProps)(
  standardLayout(Counterfirst, pageTitle)
)
