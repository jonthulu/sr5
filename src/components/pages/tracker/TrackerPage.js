import classNames from 'classnames';
import React, {PropTypes} from 'react';

import InitActions from '../../common/initActions/InitActions.js';
import charactersHoc from '../../hoc/characters.js';
import roundHoc from '../../hoc/round.js';
import CharacterModal from '../../modals/character/CharacterModal.js';
import InitiativeModal from '../../modals/initiative/InitiativeModal.js';
import ModifyInitModal from '../../modals/modifyInit/ModifyInitModal.js';

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
      modInitForCharacter: null,
      nameModalActions: null,
      initiativeModalActions: null,
      modifyInitModalActions: null,
      showDropdown: null,
    };
  }

  /**
   * Triggered when the component received new props.
   *
   * @param {{}} prevProps
   */
  componentDidUpdate(prevProps) {
    if (prevProps.charactersHoc.allOutOfInit !== this.props.charactersHoc.allOutOfInit) {
      if (this.props.charactersHoc.allOutOfInit) {
        this.startNextRound();
      }
    } else if (prevProps.charactersHoc.allHaveGone !== this.props.charactersHoc.allHaveGone) {
      if (this.props.charactersHoc.allHaveGone) {
        this.startNextPass();
      }
    }
    if (prevProps.charactersHoc.anyMissingInit !== this.props.charactersHoc.anyMissingInit) {
      if (this.props.charactersHoc.anyMissingInit && !this.props.roundHoc.isPaused) {
        this.props.roundHoc.roundPause();
      } else if (!this.props.charactersHoc.anyMissingInit && this.props.roundHoc.isPaused) {
        this.props.roundHoc.roundPause(true);
      }
    }
  }

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

    this.state.initiativeModalActions.show();
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
   * Triggered when a show menu button is clicked.
   *
   * @param {{id: string}} character
   * @param {{preventDefault: function}} clickEvent
   */
  onShowMenu = (character, clickEvent) => {
    clickEvent.preventDefault();

    this.setState({
      modInitForCharacter: character,
    }, () => {
      this.state.modifyInitModalActions.show();
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

    const activeCharacter = (roundNumber) ? this.props.charactersHoc.activeCharacter : {};

    let title = 'Round Not Started';
    if (roundNumber) {
      title = `Round ${roundNumber} - Pass ${passNumber}`;
      if (roundPaused) {
        title += ' [Paused]';
      }
    }

    return (
      <div id="tracker-page" className="system-page tracker-page row">
        <div className="column small-12 medium-8 large-8">
          <div className="callout callout-transparent pass-display">
            <h2>{title}</h2>
          </div>
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
                      <span className="character-actions button-group tiny show-for-small-only float-right">
                        <button
                          className="button alert"
                          onClick={this.onDeleteCharacter.bind(this, character)}
                        >
                          <i className="fa fa-minus-circle" />
                        </button>
                        <button className="button" onClick={this.onShowMenu.bind(this, character)}>
                          <i className="fa fa-chevron-down" />
                        </button>
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
                        <button className="button primary mod-box mod-box-stat">
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
                    <td className="small-td hide-for-small-only character-action-set">
                      <span className="character-actions button-group">
                        <button className="button alert" onClick={this.onDeleteCharacter.bind(this, character)}>
                          <i className="fa fa-minus-circle" />
                        </button>
                        <button className="button" onClick={this.onShowMenu.bind(this, character)}>
                          <i className="fa fa-chevron-down" />
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <CharacterModal
            registerModalActions={this.registerModalActions.bind(this, 'name')}
            characterId={this.state.editCharacterId || null}
            onClose={() => {
              this.setState({editCharacterId: null})
            }}
          />
          <InitiativeModal
            registerModalActions={this.registerModalActions.bind(this, 'initiative')}
          />
          <ModifyInitModal
            registerModalActions={this.registerModalActions.bind(this, 'modifyInit')}
            character={this.state.modInitForCharacter || null}
          />
        </div>
        <div className="column small-12 medium-4 large-4">
          {(this.state.nameModalActions && this.state.initiativeModalActions) && (
            <InitActions
              initiativeModalActions={this.state.initiativeModalActions}
              nameModalActions={this.state.nameModalActions}
            />
          )}
        </div>
      </div>
    );
  }
}

TicketViewPage.propTypes = {
  // Characters HOC.
  charactersHoc: PropTypes.shape({
    orderedList: PropTypes.array,
    activeCharacter: PropTypes.object,
    allHaveGone: PropTypes.bool,
    allOutOfInit: PropTypes.bool,
    anyMissingInit: PropTypes.bool,
    deleteCharacter: PropTypes.func,
    updateModifier: PropTypes.func,
  }),

  // Round HOC.
  roundHoc: PropTypes.shape({
    isPaused: PropTypes.bool,
    roundNumber: PropTypes.number,
    passNumber: PropTypes.number,
    passAdvance: PropTypes.func,
    roundAdvance: PropTypes.func,
    roundPause: PropTypes.func,
  })
};

export default charactersHoc(
  roundHoc(
    TicketViewPage
  )
);
