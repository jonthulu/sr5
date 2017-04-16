// This file merely configures the store for hot reloading.
// This boilerplate file is likely to be the same for each project that uses Redux.
// With Redux, the actual stores are in /reducers.

import {createStore, compose, applyMiddleware} from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import createSagaMiddleware from 'redux-saga';

import rootReducer, {hotReloadReducers} from '../state/reducers.js';
import sagas from '../state/sagas.js';

/**
 * Configures the development store.
 *
 * @param {*} initialState
 * @returns {*}
 */
export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [
    // Add other middleware on this line...

    // Redux middleware that spits an error on you when you try to mutate your state
    // either inside a dispatch or between dispatches.
    reduxImmutableStateInvariant(),

    // saga middleware.
    // @see {@url https://github.com/yelouafi/redux-saga/}
    sagaMiddleware,
  ];

  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middlewares),
    window.devToolsExtension ? window.devToolsExtension() : f => f // add support for Redux dev tools
  ));

  sagaMiddleware.run(sagas);

  // Enable Webpack hot module replacement for reducers
  hotReloadReducers(store);

  return store;
}
