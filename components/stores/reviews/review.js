// export default connect()(props => {
//   return (
//     <div className='review'>
//       review
//     </div>
//   )
// })

type ReviewType = {
  +_id: String,
  +store: String,
  +text: String,
  +rating: Number
}

type Props = {
  review: ReviewType
}

export default ({ review }: Props) => {
  return (
    <div className='review'>
      test
    </div>
  )
}
