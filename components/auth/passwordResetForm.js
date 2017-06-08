import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field, reduxForm, reset } from 'redux-form'
import renderField from '../inputs/renderField'
import { resetPassword, saveUserToRedux } from '../../actions/authActions'
import { toastr } from 'react-redux-toastr'
import Router from 'next/router'

class PwResetFormComponent extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  async handleFormSubmit ({ password }) {
    const token = this.props.token
    try {
      await this.props.resetPassword({ password, token })
      Router.push(`/auth/login`, `/login`)
      toastr.success('Success:', ' Password Updated!')
    } catch (e) {
      toastr.error('Error:', e.message)
    }
  }

  render () {
    // handleSubmit is a function given to us from Redux-form
    const { handleSubmit, errorMessage, valid, anyTouched } = this.props

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
        <h2>Reset Password</h2>
        <Field
          name='password'
          type='password'
          component={renderField}
          label='Password:'
        />
        <Field
          name='passwordConfirm'
          type='password'
          component={renderField}
          label='Confirm Password:'
        />
        {loginErrorText()}
        <input
          type='submit'
          className='button'
          value='Reset'
          disabled={valid === false || !anyTouched ? 'disabled' : ''}
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
function validate (formProps) {
  let errors = {}

  const requiredFields = ['password', 'passwordConfirm']

  requiredFields.forEach(field => {
    if (!formProps[field]) {
      errors[field] = 'Required'
    }
  })

  if (formProps.password !== formProps.passwordConfirm) {
    errors.passwordConfirm = 'Passwords Must Match'
  }

  return errors
}
const PwResetForm = reduxForm({ form: 'pwResetForm', validate })(
  PwResetFormComponent
)

const mapDispatchToProps = dispatch => {
  return {
    resetPassword: bindActionCreators(resetPassword, dispatch),
    saveUser: bindActionCreators(saveUserToRedux, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(PwResetForm)
