import classNames from 'classnames';
import React, {PropTypes} from 'react';

import charactersHoc from '../../hoc/characters.js';
import roundHoc from '../../hoc/round.js';
import CharacterModal from '../../modals/character/CharacterModal.js';
import InitiativeModal from '../../modals/initiative/InitiativeModal.js';

import './trackerPage.scss';

/**
 * The TicketViewPage component.
 *
 * @constructor
 */
export class TicketViewPage extends React.Component {
  /**
   * @constructor
   * @param {{}} props
   * @param {{}} componentContext
   */
  constructor(props, componentContext) {
    super(props, componentContext);

    this.state = {
      editCharacterId: null,
      nameModalActions: null,
      initiativeModalActions: null,
      showDropdown: null,
    };
  }

  componentDidUpdate(prevProps) {
    console.log('nextProps', this.props);

    if (prevProps.charactersHoc.allOutOfInit !== this.props.charactersHoc.allOutOfInit) {
      console.log('all out of init changed');
      if (this.props.charactersHoc.allOutOfInit) {
        this.startNextRound();
      }
    } else if (prevProps.charactersHoc.allHaveGone !== this.props.charactersHoc.allHaveGone) {
      console.log('all have gone changed');
      if (this.props.charactersHoc.allHaveGone) {
        this.startNextPass();
      }
    }
    if (prevProps.charactersHoc.anyMissingInit !== this.props.charactersHoc.anyMissingInit) {
      console.log('any missing init changed');
      if (this.props.charactersHoc.anyMissingInit && !this.props.roundHoc.isPaused) {
        this.props.roundHoc.roundPause();
      } else if (!this.props.charactersHoc.anyMissingInit && this.props.roundHoc.isPaused) {
        this.props.roundHoc.roundPause(true);
      }
    }
  }

  advanceRound = () => {
    console.log('advance round', this.props.characters);
    if (!this.props.roundHoc.roundNumber) {
      this.startNextRound();
      return;
    } else if (!this.props.charactersHoc.activeCharacter || !this.props.charactersHoc.activeCharacter.id) {
      this.startNextPass();
      return;
    } else if (this.props.charactersHoc.allOutOfInit) {
      this.state.initiativeModalActions.show();
      return;
    }

    this.props.charactersHoc.updateWentThisPass(
      this.props.charactersHoc.activeCharacter.id,
      true
    );
  };

  startNextPass = () => {
    console.log('starting next pass');
    this.props.roundHoc.passAdvance();
  };

  startNextRound = () => {
    console.log('starting next round');
    this.props.roundHoc.roundAdvance();

    this.state.initiativeModalActions.show();
  };

  /**
   * Unpauses the round.
   */
  unpauseRound = () => {
    if (this.props.charactersHoc.anyMissingInit) {
      this.state.initiativeModalActions.show();
    } else {
      this.props.roundHoc.roundPause(true);
    }
  };

  /**
   * Registers the thank you modal actions.
   *
   * @param {string} modalType
   * @param {{open: function, close: function, toggle: function}} actions
   */
  registerModalActions = (modalType, actions) => {
    const stateName = `${modalType}ModalActions`;

    this.setState({
      [stateName]: actions
    })
  };

  /**
   * Triggered when the character name is clicked.
   *
   * @param {{id: string}} character
   * @param {{preventDefault: function}} clickEvent
   */
  onCharClick = (character, clickEvent) => {
    clickEvent.preventDefault();

    if (this.state.nameModalActions) {
      this.setState({
        editCharacterId: character.id,
      }, () => {
        this.state.nameModalActions.show();
      });
    }
  };

  /**
   * Triggered when the delete character button is clicked.
   *
   * @param {{id: string}} character
   * @param {{preventDefault: function}} clickEvent
   */
  onDeleteCharacter = (character, clickEvent) => {
    clickEvent.preventDefault();

    this.props.charactersHoc.deleteCharacter(character.id);
  };

  /**
   * Triggered when the initiative modal has updated the characters.
   */
  onInitModalSubmit = () => {

  };

  /**
   * Opens the initiative modal.
   */
  onChangeInitClick = () => {
    this.state.initiativeModalActions.show();
  };

  /**
   * Triggered when the init is modified from the dropdown.
   *
   * @param {{id: string}} character
   * @param {number} modifyAmount
   * @param {{preventDefault: function}} clickEvent
   */
  onModifyInit = (character, modifyAmount, clickEvent) => {
    clickEvent.preventDefault();

    this.props.charactersHoc.modifyInitiative(character.id, modifyAmount);
  };

  /**
   * Triggered when the new character button is clicked.
   *
   * @param {{preventDefault: function}} clickEvent
   */
  onNewCharClick = (clickEvent) => {
    clickEvent.preventDefault();

    this.props.roundHoc.roundPause();

    if (this.state.nameModalActions) {
      this.state.nameModalActions.show();
    }
  };

  /**
   * Triggered when a show menu button is clicked.
   *
   * @param {{id: string}} character
   * @param {{preventDefault: function}} clickEvent
   */
  onShowMenu = (character, clickEvent) => {
    clickEvent.preventDefault();

    this.setState({
      showDropdown: (this.state.showDropdown === character.id) ? null : character.id,
    });
  };

  /**
   * Updates the modifiers on a character.
   *
   * @param {{id: string}} character
   * @param {number|string} modValue
   */
  onUpdateCharacterModifier = (character, modValue) => {
    const currentMod = character.mod || 0;

    let newModValue = null;
    if (modValue === '-') {
      newModValue = currentMod - 1;
    } else if (modValue === '+') {
      newModValue = currentMod + 1;
    } else if (parseInt(modValue, 10) === modValue) {
      newModValue = modValue;
    } else {
      return;
    }

    this.props.charactersHoc.updateModifier(character.id, newModValue);
  };

  /**
   * Renders the component.
   *
   * @returns {{}}
   */
  render() {
    const passNumber = this.props.roundHoc.passNumber || 0;
    const roundNumber = this.props.roundHoc.roundNumber || 0;
    const roundPaused = this.props.roundHoc.isPaused || false;
    const charactersList = this.props.charactersHoc.orderedList || [];

    let activeCharacter = (roundNumber) ? this.props.charactersHoc.activeCharacter : {};

    let title = 'Round Not Started';
    if (roundNumber) {
      title = `Round ${roundNumber} - Pass ${passNumber}`;
      if (roundPaused) {
        title += ' [Paused]';
      }
    }

    return (
      <div id="tracker-page" className="system-page tracker-page">
        <div className="callout pass-display">
          <h2>{title}</h2>
        </div>
        <span className="button-group expanded">
          <button className="button secondary add-char-button" onClick={this.onNewCharClick}>
            <span>Add New Character</span>
            <i className="fa fa-user" />
          </button>
          {(roundNumber) && (
            <button className="button warning change-init-button" onClick={this.onChangeInitClick}>
              <span>Update Init</span>
              <i className="fa fa-sort" />
            </button>
          )}
        </span>
        <table className="stack tracker-table">
          <thead>
            <tr>
              <th>Init</th>
              <th>Name</th>
              <th>Modifiers</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {charactersList.map((character, charIndex) => {
              const isActive = {
                active: (character.id === activeCharacter.id),
                went: (character.wentThisPass)
              };

              return (
                <tr className={classNames(isActive)} key={charIndex}>
                  <td className="clearfix">
                    <a
                      className="stack-label show-for-small-only"
                      onClick={this.onCharClick.bind(this, character)}
                    >{character.name}</a>
                    <span className="table-value">
                      {(character.init || character.init === 0) ? (
                        <span>
                          <span className="char-init">{character.init}</span>
                          <span className="char-raw-init">[{character.rawInit}]</span>
                        </span>
                      ) : (
                        <span>-</span>
                      )}
                    </span>
                    <span className="button-group tiny show-for-small-only float-right">
                      <button
                        className="button alert"
                        onClick={this.onDeleteCharacter.bind(this, character)}
                      >
                        <i className="fa fa-minus-circle" />
                      </button>
                      <button className="button" onClick={this.onShowMenu.bind(this, character)}>
                        <i className="fa fa-chevron-down" />
                      </button>
                      <ul className={classNames(
                        'dropdown-pane right',
                        {'dropdown-show': (this.state.showDropdown === character.id)}
                      )}>
                        <li><strong>Modify Initiative - {character.name}</strong></li>
                        <li><a onClick={this.onModifyInit.bind(this, character, -5)}>Modify (-5)</a></li>
                        <li><a onClick={this.onModifyInit.bind(this, character, -10)}>Modify (-10)</a></li>
                        <li><a onClick={this.onModifyInit.bind(this, character, -5)}>Block (-5)</a></li>
                        <li><a onClick={this.onModifyInit.bind(this, character, -5)}>Dodge (-5)</a></li>
                        <li><a onClick={this.onModifyInit.bind(this, character, -5)}>Hit the Dirt (-5)</a></li>
                        <li><a onClick={this.onModifyInit.bind(this, character, -5)}>Intercept (-5)</a></li>
                        <li><a onClick={this.onModifyInit.bind(this, character, -5)}>Parry (-5)</a></li>
                        <li><a onClick={this.onModifyInit.bind(this, character, -10)}>Full Defence (-10)</a></li>
                      </ul>
                    </span>
                  </td>
                  <td className="hide-for-small-only">
                    <span className="stack-label show-for-small-only">Name</span>
                    <a
                      className="table-value char-name"
                      onClick={this.onCharClick.bind(this, character)}
                    >{character.name}</a>
                  </td>
                  <td>
                    <span className="button-group expanded">
                      <button
                        className="button primary mod-box"
                        onClick={this.onUpdateCharacterModifier.bind(this, character, '-')}
                      >
                        <i className="fa fa-minus" />
                      </button>
                      <button className="button hollow secondary mod-box">
                        <span className="mod-text">
                          {(character.mod > 0) ? `+${character.mod || 0}` : (character.mod || 0)}
                        </span>
                      </button>
                      <button
                        className="button primary mod-box"
                        onClick={this.onUpdateCharacterModifier.bind(this, character, '+')}
                      >
                        <i className="fa fa-plus" />
                      </button>
                    </span>
                  </td>
                  <td className="small-td hide-for-small-only">
                    <span className="button-group">
                      <button className="button alert" onClick={this.onDeleteCharacter.bind(this, character)}>
                        <i className="fa fa-minus-circle" />
                      </button>
                      <button className="button" onClick={this.onShowMenu.bind(this, character)}>
                        <i className="fa fa-chevron-down" />
                      </button>
                      <ul className={classNames(
                        'dropdown-pane right',
                        {'dropdown-show': (this.state.showDropdown === character.id)}
                      )}>
                        <li><strong>Modify Initiative - {character.name}</strong></li>
                        <li><a onClick={this.onModifyInit.bind(this, character, -5)}>Modify (-5)</a></li>
                        <li><a onClick={this.onModifyInit.bind(this, character, -10)}>Modify (-10)</a></li>
                        <li><a onClick={this.onModifyInit.bind(this, character, -5)}>Block (-5)</a></li>
                        <li><a onClick={this.onModifyInit.bind(this, character, -5)}>Dodge (-5)</a></li>
                        <li><a onClick={this.onModifyInit.bind(this, character, -5)}>Hit the Dirt (-5)</a></li>
                        <li><a onClick={this.onModifyInit.bind(this, character, -5)}>Intercept (-5)</a></li>
                        <li><a onClick={this.onModifyInit.bind(this, character, -5)}>Parry (-5)</a></li>
                        <li><a onClick={this.onModifyInit.bind(this, character, -10)}>Full Defence (-10)</a></li>
                      </ul>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {(roundPaused) ? (
          <button
            className="button primary expanded next-pass-button"
            onClick={this.unpauseRound}
          >
            <span>Resume Round</span>
            <i className="fa fa-play" />
          </button>
        ) : (
          <button
            className="button primary expanded next-pass-button"
            onClick={this.advanceRound}
          >
            {(roundNumber) ? (
              <span>
                <span>End {this.props.charactersHoc.activeCharacter.name} Pass</span>
                <i className="fa fa-chevron-right" />
              </span>
            ) : (
              <span>
                <span>Start Round</span>
                <i className="fa fa-play" />
              </span>
            )}
          </button>
        )}

        <div className="actions-wrapper button-group expanded override-buttons">
          <button className="button alert" onClick={() => this.props.roundHoc.roundStop()}>
            <i className="fa fa-stop" />
            <span>Stop Rounds</span>
          </button>
          <button className="button warning" onClick={() => this.props.roundHoc.roundAdvance()}>
            <span>New Round</span>
            <i className="fa fa-refresh" />
          </button>
          <button className="button warning" onClick={() => this.props.roundHoc.passAdvance()}>
            <span>Next Pass</span>
            <i className="fa fa-fast-forward" />
          </button>
        </div>

        <InitiativeModal
          registerModalActions={this.registerModalActions.bind(this, 'initiative')}
          onSubmit={this.onInitModalSubmit}
        />
        <CharacterModal
          registerModalActions={this.registerModalActions.bind(this, 'name')}
          characterId={this.state.editCharacterId || null}
          onClose={() => {
            this.setState({editCharacterId: null})
          }}
        />
      </div>
    );
  }
}

TicketViewPage.propTypes = {
  // Characters HOC.
  charactersHoc: PropTypes.shape({
    list: PropTypes.object,
    orderedList: PropTypes.array,
    activeCharacter: PropTypes.object,
    allHaveGone: PropTypes.bool,
    allOutOfInit: PropTypes.bool,
    anyMissingInit: PropTypes.bool,
    createNewCharacter: PropTypes.func,
    deleteCharacter: PropTypes.func,
    flipCoin: PropTypes.func,
    //resetRound: PropTypes.func,
    restartInitiative: PropTypes.func,
    updateInitiative: PropTypes.func,
    updateModifier: PropTypes.func,
    updateName: PropTypes.func,
    updateWentThisPass: PropTypes.func,
  }),

  // Round HOC.
  roundHoc: PropTypes.shape({
    isPaused: PropTypes.bool,
    roundNumber: PropTypes.number,
    passNumber: PropTypes.number,
    passAdvance: PropTypes.func,
    roundAdvance: PropTypes.func,
    roundPause: PropTypes.func,
    roundReset: PropTypes.func,
    roundStop: PropTypes.func,
  })
};

export default charactersHoc(
  roundHoc(
    TicketViewPage
  )
);
