export default ({ time }) => {
  return (
    <div>
      <style jsx>{`
        div {
          padding: 15px;
          display: inline-block;
          color: #82FA58;
          font: 50px menlo, monaco, monospace;
          background-color: #000;
        }

        .light {
          background-color: #999;
        }
      `}</style>
      <p>Is token expired</p>
      <p>
        {time.isExpired.toString()}
      </p>
      <p>Time Left on Token</p>
      <p>
        {time.minLeft.toString()}
        {' '}
        min :
        {' '}
        {time.secLeft || 0}
        {' '}
        secs
      </p>
      <p>
        Is token within {time.refreshWindow} min of expiring?
      </p>
      <p>
        {time.refresh.toString()}
      </p>
    </div>
  )
}
