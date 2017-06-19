// @flow
import Review from './review'
import React from 'react'
import { connect } from 'react-redux'
import type { Review as ReviewType } from '../../../flowTypes/Review'

type Props = {
  reviews: ReviewType[]
}

const reviewList = ({ reviews }: Props) => {
  const renderStores = (): React.Element<*>[] | React.Element<*> => {
    if (reviews) {
      return reviews.map(review => {
        return <Review key={review._id} {...review} />
      })
    }
    return <div>There are no reviews yet. </div>
  }

  return (
    <div className='reviews'>
      {renderStores()}
    </div>
  )
}

export default connect()(reviewList)
