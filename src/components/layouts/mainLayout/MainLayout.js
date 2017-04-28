import React, {PropTypes} from 'react';

import './mainLayout.scss';

/**
 * The TicketLayout component.
 */
export class TicketLayout extends React.Component {
  /**
   * @constructor
   * @param {{}} props
   * @param {{}} componentContext
   */
  constructor(props, componentContext) {
    super(props, componentContext);
  }

  /**
   * Renders the component.
   *
   * @returns {{}}
   */
  render() {
    return (
      <div className="main-layout">
        <div className="top-bar">
          <div className="top-bar-left">
            <ul className="menu">
              <li className="menu-text">SR5 Initiative Tracker</li>
            </ul>
          </div>
        </div>
        <div id="main-container" className="container" role="main">
          {this.props.children}
        </div>
      </div>
    );
  }
}

TicketLayout.propTypes = {
  children: PropTypes.element,
  location: PropTypes.object,
  state: PropTypes.object,
};

export default TicketLayout;
