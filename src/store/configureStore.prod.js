import {createStore, compose, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../state/reducers.js';
import sagas from '../state/sagas.js';

/**
 * Configures the production store.
 *
 * @param {*} initialState
 * @returns {*}
 */
export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [
    // Add other middleware on this line...

    // saga middleware.
    // @see {@url https://github.com/yelouafi/redux-saga/}
    sagaMiddleware,
  ];

  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middlewares)
  ));

  sagaMiddleware.run(sagas);

  return store;
}
