// @flow

import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addRating, addRatingToStore } from '../../actions/storesActions'
import { toastr } from 'react-redux-toastr'
import type { reduxForm as reduxFormType } from '../../flowTypes/reduxForm'

type Props = {
  addRating: Function,
  postId?: string
} & reduxFormType

type ReviewSubmitProps = { text: string, rating: number, postId?: string }

export class ReviewForm extends Component<void, Props, void> {
  constructor (props: Props) {
    super(props)
    const self: any = this
    self.handleFormSubmit = this.handleFormSubmit.bind(this)
  }
  async handleFormSubmit (formProps: ReviewSubmitProps) {
    console.log(formProps)

    formProps.postId = this.props.postId
    // call action creator to sign up the user on the server
    try {
      const newRating = await this.props.addRating(formProps)
      console.log('rating')
      console.log(newRating)

      // this.props.addRatingToStore(this.props.postId, newRating)
      toastr.success('Success:', 'Comment Added')
      // push to new page
    } catch (e) {
      console.log('handle error in review form')
      console.log(e)

      if (Array.isArray(e)) {
        e.forEach(err => {
          toastr.error('Error:', err.msg)
        })
      } else {
        toastr.error('Error:', e)
      }
    }
  }
  buildStars () {
    const numbers = [5, 4, 3, 2, 1]
    return numbers.map(num => {
      return [
        <Field
          id={`star${num}`}
          name='rating'
          type='radio'
          component='input'
          value={`${num}`}
        />,
        <label htmlFor={`star${num}`} />
      ]
    })
  }

  render () {
    const { handleSubmit, valid } = this.props

    return (
      <form className='reviewer' onSubmit={handleSubmit(this.handleFormSubmit)}>
        <Field
          name='text'
          component='textarea'
          placeholder='Did you try this place? Have something to say? Leave a review...'
          label='Email:'
        />
        <div className='reviewer__meta'>
          <div className='reviewer__stars'>
            {this.buildStars()}
          </div>
          <input
            type='submit'
            className='button'
            value='Submit Review'
            disabled={valid === false ? 'disabled' : ''}
          />
        </div>
      </form>
    )
  }
}

function validate (formProps: ReviewSubmitProps) {
  let errors = {}

  const requiredFields = ['rating', 'text']

  requiredFields.forEach(field => {
    if (!formProps[field]) {
      errors[field] = 'Required'
    }
  })

  return errors
}

const ReviewReduxForm = reduxForm({
  form: 'register',
  validate
})(ReviewForm)

const mapDispatchToProps = dispatch => {
  return {
    addRating: bindActionCreators(addRating, dispatch),
    addRatingToStore: bindActionCreators(addRatingToStore, dispatch)
  }
}

// const mapStateToProps = (state, ownProps) => {

//     return {
//         errorMessage: state.auth.error
//     }

// };

export default connect(null, mapDispatchToProps)(ReviewReduxForm)
