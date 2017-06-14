import { connect } from 'react-redux'
import Review from './review'
import React from 'react'

export default connect()(props => {
  const renderStores = () => {
    return props.reviews.map(review => {
      return <Review key={review._id} {...review} />
    })
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
