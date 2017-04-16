import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as roundActions from '../../state/rounds/actions.js';

/**
 * A higher client component wrapper that loads round data from redux.
 *
 * @param {Object} WrappedComponent
 * @returns {Object}
 */
export default function roundHoc(WrappedComponent) {
  /**
   * The Round higher client component.
   */
  class RoundHOC extends React.Component {
    /**
     * @constructor
     * @param {{}} props
     * @param {{}} componentContext
     */
    constructor(props, componentContext) {
      super(props, componentContext);
    }

    /**
     * Renders the WrappedComponent.
     *
     * @returns {Object}
     */
    render() {
      const newProps = {
        roundHoc: Object.assign({}, this.props.roundActions, this.props.roundState)
      };

      return <WrappedComponent {...this.props} {...newProps} />
    }
  }

  RoundHOC.propTypes = {
    // The Redux state.
    roundState: PropTypes.object,

    // The Redux actions.
    roundActions: PropTypes.shape({
      passAdvance: PropTypes.func,
      roundAdvance: PropTypes.func,
      roundPause: PropTypes.func,
      roundReset: PropTypes.func,
      roundStop: PropTypes.func,
    }).isRequired,
  };

  /**
   * Maps redux state parameters into the component props object.
   *
   * @param {{}} state
   * @returns {{}} The state parameters to add to props.
   */
  function mapStateToProps(state) {
    return {
      roundState: state.rounds,
    };
  }

  /**
   * Maps a list of redux actions into the component props object.
   *
   * @param {function} dispatch
   * @returns {{}} The action lists of add to props.
   */
  function mapDispatchToProps(dispatch) {
    return {
      roundActions: bindActionCreators(roundActions, dispatch),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(RoundHOC);
}
