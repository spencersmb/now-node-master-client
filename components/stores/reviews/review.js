// @flow
import type { Review } from '../../../flowTypes/Review'
import moment from 'moment'

type Props = Review

export default (review: Props) => {
  return (
    <div className='review'>
      <div className='review__header'>
        <div className='review__author'>
          <img
            src={
              review.author.gravatar
                ? review.author.gravatar
                : '/static/images/photos/default.jpg'
            }
            alt=''
            className='avatar'
          />
          <p>{review.author.name}</p>
        </div>
        <div
          className='review__stars'
          title={`Rated ${String(review.rating)} out of 5 stars`}
        >
          {`★`.repeat(review.rating)}
          {`☆`.repeat(5 - review.rating)}
        </div>
        <div className='review__time' dateTime={review.created}>
          {moment(review.created).fromNow()}
        </div>
      </div>
      <div className='review__body'>
        <p>{review.text}</p>
      </div>
    </div>
  )
}
