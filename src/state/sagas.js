// Inject all the sagas from state/* folders using Webpack magic (require.context).
// We are doing this in lieu of importing each saga and manually doing an Object.assign().
const sagaModules = require.context('./', true, /^\.\/([^\/]+\/)+[sS]agas?\.js$/);

const sagas = sagaModules.keys().reduce(function reduceModulesToSingleMap(allSagas, modulePath) {
  return allSagas.concat(sagaModules(modulePath).default);
}, []);

/**
 * Yields all the sagas. Acts as a root saga.
 */
export default function* rootSaga() {
  yield sagas;
}
