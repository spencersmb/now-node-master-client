import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { svgs } from '../../config/svgs'
import { renderSvg } from '../../utils/storeHelpers'
import { heartAction } from '../../actions/storesActions'

class StoreCard extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.onSubmit = this.onSubmit.bind(this)
  }

  async onSubmit (e) {
    e.preventDefault()

    const button = e.target.childNodes[0]
    const response = await this.props.heartStore(this.props._id)

    // Add Animation to button if the store is in user array
    if (response.includes(this.props._id)) {
      button.classList.add('heart__button--float')

      setTimeout(() => {
        button.classList.remove('heart__button--float')
      }, 2500)
    }
  }

  render () {
    const {
      name,
      photo,
      slug,
      description,
      _id,
      author,
      user,
      reviews
    } = this.props
    const photoUrl = photo || '/static/images/photos/store.png'

    const hasEdit = () => {
      if (author && author === user.sub) {
        return true
      }
      return false
    }

    const displayReviews = () => {
      if (reviews) {
        return (
          <div className='store__action store__action--count'>
            {renderSvg(svgs.Review)}
            <span>{reviews.length}</span>
          </div>
        )
      }
    }
    const displayEditLink = () => {
      if (hasEdit()) {
        return (
          <div className='store__action store__action--edit'>

            <Link as={`/store/${_id}/edit`} href={`/store/edit?id=${_id}`}>
              <a>{renderSvg(svgs.Pencil)}{name}</a>
            </Link>
          </div>
        )
      }
    }

    const getHeartClass = (hearts, id) => {
      return hearts.includes(id)
        ? 'heart__button heart__button--hearted'
        : 'heart__button'
    }

    const displayheart = () => {
      if (user.isAuthenticated) {
        return (
          <div className='store__action store__action--heart'>
            <form className='heart' onSubmit={this.onSubmit}>
              <button
                type='submit'
                name='heart'
                className={getHeartClass(user.hearts, _id)}
              >
                {renderSvg(svgs.Heart)}
              </button>
            </form>
          </div>
        )
      }
    }

    return (
      <div className='store'>
        <div className='store__hero'>
          <div className='store__actions'>
            {displayheart()}
            {displayEditLink()}
            {displayReviews()}
          </div>
          <img src={photoUrl} alt='' />
          <h2 className='title'>
            <Link as={`/store/${slug}`} href={`/store/details?slug=${slug}`}>
              <a>{name}</a>
            </Link>
          </h2>
        </div>
        <div className='store__details'>
          {/* truncater hack */}
          <p>
            {description ? description.split(' ').slice(0, 25).join(' ') : ''}
          </p>
        </div>
      </div>
    )
  }
}
const mapDispatchToProps = dispatch => {
  return {
    heartStore: bindActionCreators(heartAction, dispatch)
  }
}
export default connect(null, mapDispatchToProps)(StoreCard)

// export default props => {
// export default connect(null, mapDispatchToProps)(props => {
//   const { name, photo, slug, description, _id, author, user } = props

//   const photoUrl = photo || '/static/images/photos/store.png'

//   const id = _id

//   const hasEdit = () => {
//     if (author && author === user.sub) {
//       return true
//     }
//     return false
//   }

//   const displayEditLink = () => {
//     if (hasEdit()) {
//       return (
//         <Link as={`/store/${id}/edit`} href={`/store/edit?id=${id}`}>
//           <a>{renderSvg(svgs.Pencil)}{name}</a>
//         </Link>
//       )
//     }
//   }

//   // convert to component
//   const displayheart = () => {
//     let heartClass = getHeartClass(user.hearts, _id)

//     const onSubmit = async function (e) {
//       e.preventDefault()
//       const button = document.querySelectorAll('.heart__button')
//       const response = await props.heartStore(_id)
//       // button.classList.add('heart__button--float')
//       // response.includes(_id)
//       //   ? button.classList.add('heart__button--float')
//       //   : button.classList.remove('heart__button--float')
//       console.log('this')
//       console.log(this)
//       // console.log(button)

//       // heartClass = getHeartClass(response, _id, true)
//     }

//     if (user.isAuthenticated) {
//       return (
//         <div className='store__action store__action--heart'>
//           <div className='test' onClick={testClick}>TEST</div>
//         </div>
//       )
//     }
//   }

//   const testClick = (e, i) => {
//     console.log('e')
//     console.log(e)
//     console.log('i')
//     console.log(i)
//   }

//   return (
//     <div className='store'>
//       <div className='store__hero'>
//         <div className='store__actions'>
//           {displayheart()}
//           <div className='store__action store__action--edit'>
//             {displayEditLink()}
//           </div>
//         </div>
//         <img src={photoUrl} alt='' />
//         <h2 className='title'>
//           <Link as={`/store/${slug}`} href={`/store/details?slug=${slug}`}>
//             <a>{name}</a>
//           </Link>
//         </h2>
//       </div>
//       <div className='store__details'>
//         {/* truncater hack */}
//         <p>{description.split(' ').slice(0, 25).join(' ')}</p>
//       </div>
//     </div>
//   )
// })
