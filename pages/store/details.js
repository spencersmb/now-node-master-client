import React from 'react'
import Link from 'next/link'
import { initStore } from '../../store'
import withRedux from 'next-redux-wrapper'
import standardLayout from '../../hocs/standardLayout'
import { getSingleStore } from '../../actions/storesActions'
import ReviewReduxForm from '../../components/stores/reviewForm'
import ReviewList from '../../components/stores/reviews/reviewList'

const pageTitle = 'Our Store'

// this works but not on server side....
// On secure HOC - ComponentDid mount must check if user logged in. Our Error hander will just log user out,
// but the HOC will reRoute

class StorePage extends React.Component {
  static async getInitialProps (ctx) {
    const slug = ctx.query.slug
    let post = ''

    /*
    Check if stores is cached, if they are not, it gets a single store and puts it in redux and returns it to our post obj
    Then it makes a seperate api call to get all the stores to place them in redux
    */
    try {
      /* technically we should be filtering off the redux data, but right now im just
      testing sending data down from getInitial props to populate page
      */
      post = await ctx.store.dispatch(getSingleStore(slug))
      // const cookies = findCookies(ctx.res._headers, ctx.req)
      // post = process.browser
      //   ? ''
      //   : await ctx.store.dispatch(getSingleStore(slug, cookies))
      console.log('post')
      console.log(post)
    } catch (e) {
      console.log('e')
      console.log(e)

      // handleError(e, ctx.store)
    }

    return { post }
  }

  async componentDidMount () {
    // load all stores as 2nd call for backup
    // await this.props.dispatch(getStores())
  }

  render () {
    const { user } = this.props
    const { name, slug, tags, _id, reviews } = this.props.post
    const showReviewForm = () => {
      if (user.isAuthenticated) {
        return <ReviewReduxForm postId={_id} />
      }
    }
    const hasReviews = () => {
      if (reviews) {
        return <ReviewList reviews={reviews} />
      }
    }

    const hasPost = () => {
      if (name) {
        return (
          <div>

            <div className='single'>
              <div className='single__hero'>
                <img className='single__image' src={photo} />
                <h2 className='title title--single'>
                  <Link
                    as={`/store/${slug}`}
                    href={`/store/details?slug=${slug}`}
                  >
                    <a>{name}</a>
                  </Link>
                </h2>
              </div>

            </div>

            <div className='single__details inner'>
              <img
                src='/static/images/photos/static-map.png'
                alt='google placeholder'
                className='single__map'
              />
              <p className='single__location'>Location of store</p>

              <ul className='tags'>
                {tags &&
                  tags.map((tag, index) => (
                    <li key={tag + index} className='tag'>
                      <Link as={`/tags/${tag}`} href={`/tags?tag=${tag}`}>

                        <a className='tag__link'>
                          <span className='tag__text'>{tag}</span>
                        </a>

                      </Link>
                    </li>
                  ))}
              </ul>

              {showReviewForm()}
              {hasReviews()}

            </div>

          </div>
        )
      }
    }

    const photo = this.props.post.photo || '/static/images/photos/store.png'
    return hasPost()
  }
}

const mapStateToProps = ({ user }) => ({ user })

export default withRedux(initStore, mapStateToProps)(
  standardLayout(StorePage, pageTitle)
)
