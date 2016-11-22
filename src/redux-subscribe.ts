import {getDifference} from '../object-difference'
const SUBSCRIBE = '@@redux-subscribe-ts/subscribe';
const UNSUBSCRIBE = '@@redux-subscribe-ts/unsubscribe';

/**
 * redux-subscribe-ts
 */

function subscribeMiddleware(_ref) {
    let dispatch = _ref.dispatch;
    let getState = _ref.getState;

    let subscriptions:Map<string,Map<string,Function>> = new Map<string,Map<string,Function>>();

    return function (next) {
        return function (action) {
            if (!action) {
                return
            }
            switch (action.type) {
                case SUBSCRIBE:
                {
                    let _action$payload = action.payload;
                    let path = _action$payload.path;
                    let key = _action$payload.key;
                    let fn = _action$payload.fn;

                    let subscribers:Map<string,Function> = subscriptions.get(path)
                    if (!subscribers) {
                        subscribers = new Map<string,Function>()
                        subscriptions.set(path, subscribers)
                    }
                    subscribers.set(key, fn)
                    break;
                }
                case UNSUBSCRIBE:
                {
                    let _action$payload2 = action.payload;
                    let path = _action$payload2.path;
                    let key = _action$payload2.key;

                    let subs = subscriptions.get(path);
                    if (subs) {
                        delete subs.delete(key);
                        if (subs.size === 0) {
                            subscriptions.delete(path);
                        }
                    }
                    break;
                }
                default:

                    var copyValue = function(map) {
                        if (map instanceof Array) {
                            let result = []
                            map.forEach((value, key) => {
                                result[key] = copyValue(value);
                            });
                            return result
                        }
                        else if (map instanceof Object) {
                            let result = {};
                            if (map instanceof Map) {
                                map.forEach((value, key) => {
                                    result[key] = copyValue(value);
                                });
                            }
                            else {
                                Object.keys(map).forEach(key => {
                                    result[key] = copyValue(map[key])
                                })
                            }
                            return result
                        }
                        return map
                    }

                    let prevState = getState();
                    let prevStateValues = new Map<string,any>()
                    subscriptions.forEach((subscribers,path) => prevStateValues.set(path, copyValue(prevState[path]))) // copy value
                    let result = next(action);
                    let nextState = getState();

                    subscriptions.forEach((subscribers,path) => {
                        let prev = prevStateValues.get(path)
                        let next = nextState[path]

                        let diff = getDifference(prev, next)
                        if (diff && diff.length>0) {
                            dispatch(subscribers.forEach(fn => dispatch(fn({
                                path: path,
                                prev: prev,
                                next: next,
                                diff: diff
                            }))))
                        }
                    })

                    return {
                        v: result
                    };
            }
        };
    };
}

/**
 * Action creators
 */

function subscribe(path, key, fn) {
    return {
        type: SUBSCRIBE,
        payload: {path: path, key: key, fn: fn}
    };
}

function unsubscribe(path, key) {
    return {
        type: UNSUBSCRIBE,
        payload: {path: path, key: key}
    };
}

/**
 * Exports
 */

export {subscribeMiddleware,subscribe,unsubscribe}