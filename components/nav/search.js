import { connect } from 'react-redux'
import React from 'react'
import Rx from 'rxjs/Rx'
import fetch from 'isomorphic-unfetch'
import env from '../../config/envConfig'
import Link from 'next/link'

class Search extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.keyUpHandler = this.keyUpHandler.bind(this)
    this.keyUp$ = new Rx.Subject()
    this.keyUp$
      .map(e => {
        return e.target.value
      })
      .filter(value => !value | (value.length > 2))
      .distinctUntilChanged()
      .debounceTime(500)
      // merge all events and ensures that allevents are upto date
      // If there is a value from FILTER - search the DB, else return observableOf empty array
      .switchMap(term => (term ? this.search(term) : Rx.Observable.of([])))
      .subscribe(
        response => {
          if (response.length) {
            console.log('response', response)
            this.setState({
              results: response,
              showResults: true
            })
            return
          }

          const input = this.input.value ? `for "${this.input.value}"` : ''
          this.setState({
            results: [{ name: `Sorry No results found ${input}` }],
            showResults: true
          })
        },
        e => console.log(`error ---> ${e}`),
        () => console.log('completed')
      )
    this.state = {
      results: [],
      showResults: false
    }
  }
  componentWillMount () {}
  componentDidMount () {
    this.input = document.getElementById('searchInput')
    this.input.addEventListener('focus', () => {
      console.log('input focused')
    })
    this.input.addEventListener('blur', () => {
      this.setState({ showResults: false })
    })
  }
  componentWillUnmount () {
    this.keyUp$.unsubscribe()
  }
  keyUpHandler (event) {
    if (![38, 40, 13].includes(event.keyCode)) {
      this.keyUp$.next(event)
    }
  }
  //   fetch(url).then(r => {
  //           if (r.status === 200) {
  //             return r.json()
  //           } else {
  //             let reject = Promise.reject(r)
  //             return reject
  //           }
  //         })

  async fetchUrl (url) {
    try {
      const response = await fetch(url)
      if (response.status === 200) {
        return response.json()
      }
    } catch (e) {
      throw e
    }
  }

  // simulate network request with promise
  search (term) {
    const url = `${env.BACKEND_URL}/api/search?q=${term}`
    return Rx.Observable.defer(() => {
      return Rx.Observable.fromPromise(this.fetchUrl(url))
    })
    // .retryWhen(retryStrategy());
  }

  renderSearchResults (results) {
    if (!this.state.showResults) {
      return
    }

    return results.map((r, index) => {
      return (
        <Link
          key={index}
          as={`/store/${r.slug}`}
          href={`/store/details?slug=${r.slug}`}
        >
          <a className='search__result'>
            <strong>{r.name}</strong>
          </a>
        </Link>
      )
    })
  }

  render () {
    return (
      <div className='nav__section nav__section--search'>
        <div className='search'>
          <input
            id='searchInput'
            className='search__input'
            type='text'
            placeholder='Coffee, beer...'
            name='search'
            onKeyUp={this.keyUpHandler}
          />
          <div
            className={
              this.state.showResults
                ? 'search__results show'
                : 'search__results hide'
            }
          >
            {this.renderSearchResults(this.state.results)}
          </div>
        </div>
      </div>
    )
  }
}
export default connect()(Search)
