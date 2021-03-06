# redux-subscribe-ts
- Subscribe to specific path in your redux state
- Get notified only when the sub-state (corresponding to this path) is modified
- Get state difference
- Typescript and webpack

## Dependencies
- object-difference-ts

## Usage

### Store configuration
Configure store for using subscribeMiddleware
```javascript
import {subscribeMiddleware} from '../lib/redux-subscribe-ts'
import {applyMiddleware, createStore} from 'redux'
import reducers from '../reducers'

export default function configureStore () {
    const logger = createLogger();
    return createStore(reducers,  applyMiddleware(subscribeMiddleware))
}
```

### Subscribe to state modification for a specific path
```javascript
import {subscribe} from '../lib/redux-subscribe-ts'

let onStateChange = function(stateChange) {
    // stateChange.path: state path
    // stateChange.prev: previous sub-state (corresponding to this path)
    // stateChange.next: next sub-state
    // stateChange.diff: differences between prev/next sub-states
}

// subscribe to 'store.tarifs'
store.dispatch(subscribe('path', 'uniquesubscriberkey', stateChange=>this.onStateChange(stateChange)))

// unsubscribe
store.dispatch(unsubscribe('path', 'uniquesubscriberkey'))
```

## To do
- package as NPM module
- tests

## Credits
- [redux-subscribe](https://github.com/ashaffer/redux-subscribe)
- [redux-haiku](https://github.com/xaviervia/redux-haiku)