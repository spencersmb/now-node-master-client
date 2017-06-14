import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { svgs } from '../../config/svgs'
import { renderSvg } from '../../utils/storeHelpers'
import { heartAction } from '../../actions/storesActions'
import ReviewReduxForm from './reviewForm'

class Reviews extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <div>
        <ReviewReduxForm />
      </div>
    )
  }
}
const mapDispatchToProps = dispatch => {
  return {
    heartStore: bindActionCreators(heartAction, dispatch)
  }
}
export default connect(null, mapDispatchToProps)(Reviews)
