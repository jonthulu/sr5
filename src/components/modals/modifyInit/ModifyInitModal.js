import React, {PropTypes} from 'react';

import modalFoundation from '../../hoc/modalFoundation.js';
import charactersHoc from '../../hoc/characters.js';

import './modifyInitModal.scss';

/**
 * Defines the id of the modal.
 * @type {string}
 */
const MODAL_ID = 'modify-init-modal';

/**
 * Modal Options.
 * @type {{closeOnClick: boolean}}
 */
const modalOptions = {
  closeOnClick: false,
};

/**
 * The initiative form modal.
 */
export class ModifyInitModal extends React.Component {
  /**
   * @constructor
   * @param {{}} props
   * @param {{}} componentContext
   */
  constructor(props, componentContext) {
    super(props, componentContext);

    this.state = {
      customMod: 0,
    };
  }

  /**
   * Triggered when the custom modify + or - is clicked.
   *
   * @param {string} modValue
   * @param {{preventDefault: function}} clickEvent
   */
  onChangeCustom = (modValue, clickEvent) => {
    clickEvent.preventDefault();

    const currentMod = this.state.customMod || 0;

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

    this.setState({
      customMod: newModValue,
    });
  };

  /**
   * Triggered when the custom modify button is pressed.
   *
   * @param {{preventDefault: function}} clickEvent
   */
  onModifyCustom = (clickEvent) => {
    this.onModifyInit(this.state.customMod, clickEvent);
  };

  /**
   * Triggered when the init is modified.
   *
   * @param {number} modifyAmount
   * @param {{preventDefault: function}} clickEvent
   */
  onModifyInit = (modifyAmount, clickEvent) => {
    clickEvent.preventDefault();

    this.props.charactersHoc.modifyInitiative(this.props.character.id, modifyAmount);

    this.closeModal();
  };

  /**
   * Closes the modal.
   */
  closeModal = () => {
    this.props.modalFoundation.hide();

    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  /**
   * Renders the modal.
   *
   * @returns {object}
   */
  render() {
    const character = this.props.character || {};

    return (
      <div id={MODAL_ID} className="reveal modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h1>Modify Init For <span className="char-name">{character.name}</span></h1>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="column small-4">
                  <button
                    className="button primary expanded"
                    onClick={this.onModifyInit.bind(this, -5)}
                  >
                    Modify [-5]
                  </button>

                  <div className="modify-init-divider" />

                  <ul className="moves-list">
                    <li>Block</li>
                    <li>Dodge</li>
                    <li>Parry</li>
                    <li>Intercept</li>
                    <li>Hit The Dirt</li>
                  </ul>
                </div>
                <div className="column small-4">
                  <button
                    className="button primary expanded"
                    onClick={this.onModifyInit.bind(this, -10)}
                  >
                    Modify [-10]
                  </button>

                  <div className="modify-init-divider" />

                  <ul className="moves-list">
                    <li>Full Defense</li>
                  </ul>
                </div>
                <div className="column small-4">
                  <button
                    className="button primary expanded"
                    onClick={this.onModifyCustom}
                  >
                    Custom [{this.state.customMod}]
                  </button>

                  <div className="modify-init-divider" />

                  <div className="button-group expanded">
                    <button
                      className="button secondary mod-box"
                      onClick={this.onChangeCustom.bind(this, '-')}
                    >
                      <i className="fa fa-minus" />
                    </button>
                    <button className="button secondary mod-box mod-box-stat">
                      <span className="mod-text">
                        {this.state.customMod}
                      </span>
                    </button>
                    <button
                      className="button secondary mod-box"
                      onClick={this.onChangeCustom.bind(this, '+')}
                    >
                      <i className="fa fa-plus" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="button-group large expanded">
                <button
                  type="button"
                  className="button alert"
                  onClick={this.closeModal}
                >Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ModifyInitModal.propTypes = {
  character: PropTypes.object,
  onClose: PropTypes.func,

  // Characters HOC.
  charactersHoc: PropTypes.shape({
    modifyInitiative: PropTypes.func,
  }),

  // ModalFoundation HOC
  modalFoundation: PropTypes.shape({
    hide: PropTypes.func.isRequired,
  }),
};

export default modalFoundation(MODAL_ID, modalOptions)(
  charactersHoc(
    ModifyInitModal
  )
);
