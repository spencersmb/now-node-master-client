import React from 'react'
import Link from 'next/link'

export default () => (
  <div>
    <h1>You can't see this!</h1>
    <p>
      You're not authenticated yet. Maybe you want to
      {' '}
      <Link href='/auth/login' as='/login'><a>sign in</a></Link>
      {' '}
      and see what happens?
    </p>
  </div>
)
