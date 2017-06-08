import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field, reduxForm, reset } from 'redux-form'
import {
  signinUser,
  saveUserToRedux,
  forgotUser
} from '../../actions/authActions'
import { toastr } from 'react-redux-toastr'
import Router from 'next/router'
import { getUserFromJWT } from '../../utils/authUtils'

class ForgotPasswordComponent extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  async handleFormSubmit ({ email }) {
    try {
      const response = await this.props.forgotUser({ email })
      this.props.reset()
      toastr.success('Success:', response.message)
    } catch (e) {
      toastr.error('Error:', e)
    }
  }

  render () {
    // handleSubmit is a function given to us from Redux-form
    const { handleSubmit, errorMessage, valid } = this.props
    const loginErrorText = () => {
      if (errorMessage) {
        return (
          <div className='bs-callout bs-callout-danger'>
            <h4>
              {errorMessage}
            </h4>
          </div>
        )
      }
    }

    return (
      <form className='form' onSubmit={handleSubmit(this.handleFormSubmit)}>
        <h2>I forgot my password</h2>
        <label>Email:</label>
        <Field
          className='form-control'
          name='email'
          component='input'
          type='email'
        />
        <input
          type='submit'
          className='button'
          value='Submit'
          disabled={valid === false ? 'disabled' : ''}
        />
      </form>
    )
  }
}
// Login.propTypes = {
//   handleSubmit: PropTypes.func.isRequired,
//   actions: PropTypes.object,
//   errorMessage: PropTypes.string
// }

// const mapStateToProps = (state, ownProps) => {
//     return {
//         errorMessage: state.auth.error
//     };
// };

const mapDispatchToProps = dispatch => {
  return {
    forgotUser: bindActionCreators(forgotUser, dispatch),
    saveUser: bindActionCreators(saveUserToRedux, dispatch)
  }
}

const ForgotPasswordForm = reduxForm({ form: 'forgotPasswordForm' })(
  ForgotPasswordComponent
)
export default connect(null, mapDispatchToProps)(ForgotPasswordForm)
