import React, {PropTypes} from 'react';

import charactersHocWrapper from '../../hoc/characters.js';
import roundHocWrapper from '../../hoc/round.js';

import './initActions.scss';

/**
 * The InitActions component.
 */
export class InitActions extends React.Component {
  /**
   * @constructor
   * @param {{}} props
   * @param {{}} componentContext
   */
  constructor(props, componentContext) {
    super(props, componentContext);
  }

  /**
   * Updates to a new round or pass as needed.
   */
  advanceRound = () => {
    if (!this.props.roundHoc.roundNumber) {
      this.startNextRound();
      return;
    } else if (!this.props.charactersHoc.activeCharacter || !this.props.charactersHoc.activeCharacter.id) {
      this.startNextPass();
      return;
    } else if (this.props.charactersHoc.allOutOfInit) {
      this.props.initiativeModalActions.show();
      return;
    }

    this.props.charactersHoc.updateWentThisPass(
      this.props.charactersHoc.activeCharacter.id,
      true
    );
  };

  /**
   * Triggered when the new character button is clicked.
   *
   * @param {{preventDefault: function}} clickEvent
   */
  onNewCharClick = (clickEvent) => {
    clickEvent.preventDefault();

    this.props.roundHoc.roundPause();

    if (this.props.nameModalActions) {
      this.props.nameModalActions.show();
    }
  };

  /**
   * Opens the initiative modal.
   */
  onChangeInitClick = () => {
    this.props.initiativeModalActions.show();
  };

  /**
   * Advances to the next pass.
   */
  startNextPass = () => {
    this.props.roundHoc.passAdvance();
  };

  /**
   * Advances to the next round.
   */
  startNextRound = () => {
    this.props.roundHoc.roundAdvance();

    this.props.initiativeModalActions.show();
  };

  /**
   * Un-pauses the round.
   */
  unpauseRound = () => {
    if (this.props.charactersHoc.anyMissingInit) {
      this.props.initiativeModalActions.show();
    } else {
      this.props.roundHoc.roundPause(true);
    }
  };

  /**
   * Renders the component.
   *
   * @returns {{}}
   */
  render() {
    const charactersHoc = this.props.charactersHoc;
    const roundHoc = this.props.roundHoc;

    const roundNumber = roundHoc.roundNumber || 0;
    const roundPaused = roundHoc.isPaused || false;

    return (
      <div className="init-actions-component">
        <div className="callout callout-transparent action-title">
          <h2>ACTIONS</h2>
        </div>

        <div className="action-buttons">
          {(roundPaused) ? (
            <button className="button success hollow expanded next-pass-button" onClick={this.unpauseRound}>
              <span className="button-text">Resume Round</span>
              <i className="fa fa-play" />
            </button>
          ) : (
            <button
              className="button success hollow expanded next-pass-button" onClick={this.advanceRound}>
              {(roundNumber) ? (
                <span>
                  <span className="button-text char-name">End {charactersHoc.activeCharacter.name} Pass</span>
                  <i className="fa fa-chevron-right" />
                </span>
              ) : (
                <span>
                  <span className="button-text">Start Round</span>
                  <i className="fa fa-play" />
                </span>
              )}
            </button>
          )}

          <hr />

          <button className="button secondary expanded add-char-button" onClick={this.onNewCharClick}>
            <span className="button-text">New Character</span>
            <i className="fa fa-user" />
          </button>

          <hr />

          {(Boolean(roundNumber)) && (
            <button className="button warning expanded change-init-button" onClick={this.onChangeInitClick}>
              <span className="button-text">Update Init</span>
              <i className="fa fa-sort" />
            </button>
          )}

          <button className="button warning expanded" onClick={() => roundHoc.roundAdvance()}>
            <span className="button-text">New Round</span>
            <i className="fa fa-refresh" />
          </button>
          <button className="button warning expanded" onClick={() => roundHoc.passAdvance()}>
            <span className="button-text">Next Pass</span>
            <i className="fa fa-fast-forward" />
          </button>
          <button className="button alert expanded" onClick={() => roundHoc.roundStop()}>
            <span className="button-text">Stop Rounds</span>
            <i className="fa fa-stop" />
          </button>
        </div>
      </div>
    );
  }
}

InitActions.propTypes = {
  initiativeModalActions: PropTypes.shape({
    show: PropTypes.func,
    hide: PropTypes.func,
  }).isRequired,
  nameModalActions: PropTypes.shape({
    show: PropTypes.func,
    hide: PropTypes.func,
  }).isRequired,

  // Characters HOC.
  charactersHoc: PropTypes.shape({
    activeCharacter: PropTypes.object,
    allOutOfInit: PropTypes.bool,
    anyMissingInit: PropTypes.bool,
    updateWentThisPass: PropTypes.func,
  }),

  // Round HOC.
  roundHoc: PropTypes.shape({
    isPaused: PropTypes.bool,
    roundNumber: PropTypes.number,
    passAdvance: PropTypes.func,
    roundAdvance: PropTypes.func,
    roundPause: PropTypes.func,
    roundReset: PropTypes.func,
    roundStop: PropTypes.func,
  }),
};

export default charactersHocWrapper(
  roundHocWrapper(
    InitActions
  )
);
