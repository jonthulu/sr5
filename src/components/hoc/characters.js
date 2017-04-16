import lodash from 'lodash';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as characterActions from '../../state/characters/actions.js';

/**
 * A higher client component wrapper that loads character data from redux.
 *
 * @param {Object} WrappedComponent
 * @returns {Object}
 */
export default function charactersHoc(WrappedComponent) {
  /**
   * The Character higher client component.
   */
  class CharactersHOC extends React.Component {
    /**
     * @constructor
     * @param {{}} props
     * @param {{}} componentContext
     */
    constructor(props, componentContext) {
      super(props, componentContext);
    }

    /**
     * Creates a new character.
     *
     * @param {{}} characterStats
     */
    createNewCharacter = (characterStats) => {
      this.props.characterActions.characterCreate(characterStats);
    };

    /**
     * Deletes an existing character.
     *
     * @param {string} characterId
     */
    deleteCharacter = (characterId) => {
      this.props.characterActions.characterDelete(characterId);
    };

    /**
     * Adds a coin toss value to the character.
     */
    flipCoin = (characterId) => {
      this.props.characterActions.characterUpdate(characterId, {
        coinToss: flipCoin(),
      });
    };

    /**
     * Restarts the initiative of an existing character.
     * This should ONLY be used for new rounds.
     *
     * @param {string} characterId
     * @param {number} newInit
     */
    restartInitiative = (characterId, newInit) => {
      const character = this.props.charactersState[characterId] || {};

      let init = newInit;
      if (character.modlessInit !== undefined && character.modlessInit !== null) {
        const initDifference = newInit - (character.rawInit || 0);
        init = character.modlessInit + initDifference;
      } else if (this.props.roundsState.passNumber) {
        init = newInit - ((this.props.roundsState.passNumber - 1) * 10);
      }

      this.props.characterActions.characterUpdate(characterId, {
        init: init + (character.mod || 0),
        modlessInit: init,
        rawInit: newInit,
      });
    };

    /**
     * Modifies the initiative of an existing character.
     * This should NEVER be used for new rounds.
     *
     * @param {string} characterId
     * @param {number} initDiff
     */
    modifyInitiative = (characterId, initDiff) => {
      const character = this.props.charactersState[characterId] || {};

      this.props.characterActions.characterUpdate(characterId, {
        init: (character.init || 0) + initDiff,
        modlessInit: (character.modlessInit || 0) + initDiff,
      });
    };

    /**
     * Updates the modifier of an existing character.
     *
     * @param {string} characterId
     * @param {number} newMod
     */
    updateModifier = (characterId, newMod) => {
      const character = this.props.charactersState[characterId] || {};
      const modDifference = newMod - (character.mod || 0);

      const newStats = {
        mod: newMod,
      };
      if (character.init !== undefined && character.init !== null) {
        newStats.init = character.init + modDifference;
      }

      this.props.characterActions.characterUpdate(characterId, newStats);
    };

    /**
     * Updates the stats of an existing character.
     *
     * @param {string} characterId
     * @param {{}} stats
     */
    updateStats = (characterId, stats) => {
      this.props.characterActions.characterUpdate(characterId, stats || {});
    };

    /**
     * Updates the character's went this pass state.
     *
     * @param {number} characterId
     * @param {boolean} didGoThisPass
     */
    updateWentThisPass = (characterId, didGoThisPass) => {
      this.props.characterActions.characterUpdate(characterId, {
        wentThisPass: Boolean(didGoThisPass),
      });
    };

    /**
     * Renders the WrappedComponent.
     *
     * @returns {Object}
     */
    render() {
      let list = {};
      if (this.props.charactersState) {
        list = this.props.charactersState || {};
      }

      const orderedList = lodash.values(list || {});
      orderedList.sort((a, b) => {
        if (a.init !== b.init) {
          return (b.init - a.init);
        } else if (a.edge !== b.edge) {
          return (b.edge - a.edge);
        } else if (a.reaction !== b.reaction) {
          return (b.reaction - a.reaction);
        } else if (a.intuition !== b.intuition) {
          return (b.intuition - a.intuition);
        }

        return (b.coinToss - a.coinToss);
      });

      const activeCharacter = orderedList.reduce((active, character) => {
        if (character.wentThisPass) {
          return active;
        } else if (!active.id) {
          return character;
        } else if (character.init > active.init) {
          return character;
        }
        return active;
      }, {});

      const allHaveGone = lodash.every(list, (character) => {
        return character.wentThisPass;
      });
      const allOutOfInit = lodash.every(list, (character) => {
        return character.init < 1;
      });
      const anyMissingInit = lodash.some(list, (character) => {
        return (character.init === null || character.init === undefined);
      });

      const newProps = {
        charactersHoc: {
          list: list,
          orderedList: orderedList,
          activeCharacter: activeCharacter,
          allHaveGone: allHaveGone,
          allOutOfInit: allOutOfInit,
          anyMissingInit: anyMissingInit,
          createNewCharacter: this.createNewCharacter,
          deleteCharacter: this.deleteCharacter,
          flipCoin: this.flipCoin,
          restartInitiative: this.restartInitiative,
          modifyInitiative: this.modifyInitiative,
          updateModifier: this.updateModifier,
          updateStats: this.updateStats,
          updateWentThisPass: this.updateWentThisPass,
        }
      };

      return <WrappedComponent {...this.props} {...newProps} />
    }
  }

  CharactersHOC.propTypes = {
    // The Redux state.
    charactersState: PropTypes.object,

    // The Redux actions.
    characterActions: PropTypes.shape({
      characterCreate: PropTypes.func,
      characterDelete: PropTypes.func,
      characterUpdate: PropTypes.func,
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
      charactersState: state.characters,
      roundsState: state.rounds,
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
      characterActions: bindActionCreators(characterActions, dispatch),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CharactersHOC);
}
