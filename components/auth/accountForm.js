import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, reset } from 'redux-form'
import renderDropzoneInput from '../inputs/fileInput'
// import {
//   loadForm,
//   addStore,
//   updateStore,
//   addStoreGriderAction
// } from '../../actions/storesActions'
import * as actions from '../../actions/authActions'
import checkBox from '../../components/inputs/checkbox'
import renderField from '../../components/inputs/renderField'
import env from '../../config/envConfig'
import { toastr } from 'react-redux-toastr'
import Router from 'next/router'
import { convertTagsToArray } from '../../utils/storeHelpers'
import { handleError } from '../../utils/authUtils'

class AccountFormInit extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  // Set editing state before component mounts
  componentWillMount () {}

  // update data as soon as it mounts
  componentDidMount () {
    this.props.load(this.props.selectedUser)
  }

  async handleFormSubmit (formProps) {
    try {
      const response = await this.props.updateUser(formProps)

      this.props.saveUserToRedux(response)

      toastr.success('Saved', 'User Saved Successfully!')

      // Router.push(
      //   `/store/details?slug=${response.slug}`,
      //   `/store/${response.slug}`
      // )
    } catch (e) {
      toastr.error('Error:', e.message)
    }
  }

  render () {
    const {
      handleSubmit,
      load,
      valid,
      errorMessage,
      pristine,
      reset,
      submitting,
      selectedUser
    } = this.props

    const loginErrorText = () => {
      if (errorMessage !== undefined) {
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
      <div>
        <h2>Editing: {selectedUser.name}</h2>
        <form
          className='card'
          onSubmit={handleSubmit(this.handleFormSubmit)}
          encType='multipart/form-data'
        >
          <Field
            name='name'
            type='text'
            component={renderField}
            label='Name:'
          />
          <Field
            name='email'
            type='email'
            component={renderField}
            label='Email:'
          />
          <input
            type='submit'
            className='button'
            value='Save'
            disabled={valid === false ? 'disabled' : ''}
          />

        </form>
      </div>
    )
  }
}

const validate = values => {
  const errors = {}

  // check that its an array because we are already validating type in dropzone component
  if (values.photo !== undefined && !Array.isArray(values.photo)) {
    errors.photo = 'Invalid File Type'
  }

  // if (!values.name) {
  //   errors.name = 'Required'
  // }

  return errors
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
const accountForm = reduxForm({
  form: 'initializeUserFormState', // a unique identifier for this form
  validate,
  enableReinitialize: true
})(AccountFormInit)

export default connect(
  state => ({
    initialValues: state.userAccount.data // pull initial values from account reducer
  }),
  {
    load: actions.loadAccountForm,
    // updateStore: actions.updateStore,
    reset: reset,
    // addStore: actions.addStore,
    saveUserToRedux: actions.saveUserToRedux,
    updateUser: actions.updateUser
  } // bind account loading action creator
)(accountForm)
