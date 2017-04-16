import React, {PropTypes} from 'react';

/**
 * Application CSS/SCSS files.
 */
import 'font-awesome/css/font-awesome.css';
import '../../styles/themes/baseTheme.scss';
import './app.scss';

/**
 * Application JS files.
 */
import 'foundation-sites/dist/js/foundation.js';

/**
 * The App component.
 *
 * @param {{}} props
 * @returns {{}}
 * @constructor
 */
const App = (props) => {
  return (
    <div className="app-wrapper">
      {props.children}
    </div>
  );
};

App.propTypes = {
  children: PropTypes.element,
};

export default App;
