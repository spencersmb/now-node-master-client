export default function ({ dispatch }) {
  console.log('Middleware test')
  return next => action => {
    // If action does not have payload
    // or, the payload is not a promise
    // send it on
    console.log('action')

    console.log(action)

    if (!action.data || !action.data.then) {
      return next(action)
    }

    console.log('action middleware')
    console.log(action)

    // // console.log("We have a promise");
    // //make sure the promise resolves
    // action.data.then(r => {
    //   const newAction = {
    //     ...action,
    //     data: r
    //   }
    //   //Send through all the middlewares again
    //   dispatch(newAction)
    // })
  }
}
