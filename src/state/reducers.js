import {combineReducers} from 'redux';

/**
 * Uses webpack's require.context to get all reducer files.
 *
 * @returns {Object}
 */
function getReducerContext() {
  return require.context('./', true, /^\.\/([^\/]+\/)+[rR]educers?\.js$/);
}

/**
 * Inject all the reducers from state/* folders using Webpack magic (require.context).
 * We are doing this in lieu of importing each reducer and manually doing an Object.assign().
 *
 * @param {Object} reducerContext
 * @returns {Object}
 */
function getReducers(reducerContext) {
  const reducerModules = reducerContext || getReducerContext();

  const reducers = reducerModules.keys().reduce(function reduceModulesToSingleMap(allReducers, modulePath) {
    return Object.assign({}, allReducers, reducerModules(modulePath).default);
  }, {});

  return Object.assign({}, reducers);
}

// Inject all the reducers from state/* folders using Webpack magic (require.context).
// We are doing this in lieu of importing each reducer and manually doing an Object.assign().
const reducerModules = getReducerContext();
const rootReducer = combineReducers(getReducers(reducerModules));

/**
 * Hot reloads the reducers.
 *
 * @param {{replaceReducer: function}} store
 */
export function hotReloadReducers(store) {
  if (!module.hot) {
    return;
  }

  // Enable Webpack hot module replacement for reducers
  module.hot.accept(reducerModules.id, () => {
    const newRootReducer = combineReducers(getReducers());
    store.replaceReducer(newRootReducer);
  });
}

export default rootReducer;
