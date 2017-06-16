// @flow
import Review from './review'
import React from 'react'
import { connect } from 'react-redux'

// interface ReviewType {
//   +_id: String,
//   +store: String,
//   +text: String,
//   +rating: Number
// }

type ReviewType = {
  +_id: String,
  +store: String,
  +text: String,
  +rating: Number
}

type Props = {
  reviews: ReviewType[]
}

const reviewList = ({ reviews }: Props) => {
  const renderStores = (): React.Element<*>[] | React.Element<*> => {
    if (reviews) {
      return reviews.map(review => {
        review._id = 2
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

reviewList.PropTypes = {
  reviews: []
}

export default connect()(reviewList)

// export default connect()(({ reviews }: Props): React.Element<*> => {
//   const renderStores = (): React.Element<*>[] | React.Element<*> => {
//     if (reviews) {
//       return reviews.map(review => {
//         return <Review key={review._id} {...review} />
//       })
//     }
//     return <div>There are no reviews yet. </div>
//   }
//   return (
//     <div className='reviews'>
//       {renderStores()}
//     </div>
//   )
// })

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
