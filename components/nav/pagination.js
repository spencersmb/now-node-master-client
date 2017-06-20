// @flow
import { connect } from 'react-redux'
import Link from 'next/link'

const mapStateToProps = (state, ownProps) => {
  return {
    // stores: state.stores.data,
    pages: state.stores.pages,
    pagination: state.pagination.pages.stores,
    currentPage: state.pagination.currentPage
  }
}

export default connect(mapStateToProps)(props => {
  const { pages, currentPage } = props

  const nextButton = () => {
    if (currentPage < pages) {
      return (
        <div className='pagination__next'>
          <Link
            prefetch
            as={`/stores/page/${parseInt(currentPage) + 1}`}
            href={`/store/page?pageId=${parseInt(currentPage) + 1}`}
          >
            <a>Next</a>
          </Link>
        </div>
      )
    }
  }

  const prevButton = () => {
    if (currentPage > 1) {
      return (
        <div className='pagination__prev'>
          <Link
            as={`/stores/page/${parseInt(currentPage) - 1}`}
            href={`/store/page?pageId=${parseInt(currentPage) - 1}`}
          >
            <a>Prev</a>
          </Link>
        </div>
      )
    }
  }
  return (
    <div className='pagination'>
      {prevButton()}
      <div className='pagination__text'>Page {currentPage} of {pages}</div>
      {nextButton()}
    </div>
  )
})
