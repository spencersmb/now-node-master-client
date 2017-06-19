import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import type { Store } from '../../flowTypes/Store'

type Props = Store

class TopStoreCard extends React.Component<void, Props, void> {
  render () {
    console.log('props', this.props)

    const { averageRating, index, reviews, photo, name, slug } = this.props
    return (
      <tr>
        <td>
          <img width='200' src={photo} alt={name} />
        </td>
        <td>{index + 1}</td>
        <td>
          <Link as={`/store/${slug}`} href={`/store/details?slug=${slug}`}>
            <a>{name}</a>
          </Link>
        </td>
        <td>{reviews.length}</td>
        <td>{Math.round(averageRating * 10) / 10} / 5</td>
      </tr>
    )
  }
}

export default connect()(TopStoreCard)
