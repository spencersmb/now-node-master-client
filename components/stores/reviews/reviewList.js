// @flow
import Review from './review'
import React from 'react'
import { connect } from 'react-redux'

interface iReview {
  _id: String,
  store: String,
  text: String,
  rating: Number
}

type Props = {
  reviews?: iReview[]
}

export default connect()(({ reviews }: Props) => {
  const renderStores = () => {
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
})

// class reviewList extends React.Component {
//   renderStores () {
//     return this.props.reviews.map(review => {
//       return <Review key={review._id} {...review} />
//     })
//   }

//   render () {
//     return (
//       <div className='reviews'>
//         {this.renderStores()}
//       </div>
//     )
//   }
// }

// export default connect()(reviewList)
