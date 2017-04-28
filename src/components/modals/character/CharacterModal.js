import lodash from 'lodash';
import React, {PropTypes} from 'react';

import modalFoundation from '../../hoc/modalFoundation.js';
import charactersHoc from '../../hoc/characters.js';

import './characterModal.scss';

/**
 * Defines the id of the modal.
 * @type {string}
 */
const MODAL_ID = 'character-modal';

/**
 * Modal Options.
 * @type {{closeOnClick: boolean}}
 */
const modalOptions = {
  closeOnClick: false,
};

/**
 * The character form modal.
 */
export class CharacterModal extends React.Component {
  /**
   * @constructor
   * @param {{}} props
   * @param {{}} componentContext
   */
  constructor(props, componentContext) {
    super(props, componentContext);

    this.state = {
      errorEmptyForm: false,
      form: {
        name: '',
        edge: '',
        reaction: '',
        intuition: '',
      },
    }
  }

  /**
   * Triggered when the component in about to receive props.
   *
   * @param {{}} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.characterId && this.props.characterId !== nextProps.characterId) {
      const characters = nextProps.charactersHoc.list || {};
      const characterStats = characters[nextProps.characterId];
      if (characterStats) {
        this.setState({
          errorEmptyForm: false,
          form: {
            name: characterStats.name,
            edge: characterStats.edge,
            reaction: characterStats.reaction,
            intuition: characterStats.intuition,
          }
        });
      }
    }
  }

  /**
   * Updates the state when the form changes.
   *
   * @param {string} field
   * @returns {function}
   */
  updateForm = (field) => {
    /**
     * Updates the state with the given form value.
     *
     * @param {string|{target: {value: string}}} formValueOrEvent
     */
    return (formValueOrEvent) => {
      let formValue = formValueOrEvent;
      if (typeof formValueOrEvent === 'object' && formValueOrEvent.target) {
        formValue = formValueOrEvent.target.value;
      }

      const newForm = Object.assign({}, this.state.form, {
        [field]: formValue
      });

      this.setState({
        errorEmptyForm: false,
        form: newForm,
      });
    };
  };

  /**
   * Closes the modal.
   */
  closeModal = () => {
    this.setState({
      errorEmptyForm: false,
      form: {
        name: '',
        edge: '',
        reaction: '',
        intuition: '',
      }
    }, () => {
      this.props.modalFoundation.hide();

      if (this.props.onClose) {
        this.props.onClose();
      }
    });
  };

  /**
   * Submits the change request form.
   *
   * @param {{preventDefault: function}} submitEvent
   */
  submitForm = (submitEvent) => {
    submitEvent.preventDefault();

    const values = lodash.values(this.state.form);
    if (lodash.filter(values).length !== values.length) {
      this.setState({
        errorEmptyForm: true,
      });
      return;
    }

    if (this.props.characterId) {
      this.props.charactersHoc.updateStats(this.props.characterId, this.state.form);
    } else {
      this.props.charactersHoc.createNewCharacter(this.state.form);
    }

    this.closeModal();
  };

  /**
   * Renders the modal.
   *
   * @returns {object}
   */
  render() {
    return (
      <div id={MODAL_ID} className="reveal modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h1>{(this.props.characterId) ? 'Edit' : 'New'} Character</h1>
            </div>
            <div className="modal-body">
              <form className="form" onSubmit={this.submitForm}>
                <div className="row">
                  <div className="small-12 columns">
                    <label>
                      Character Name
                      <input
                        type="text"
                        placeholder="Character Name"
                        value={this.state.form.name}
                        onChange={this.updateForm('name')}
                      />
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="small-12 medium-4 columns">
                    <label>
                      Edge
                      <input
                        type="number"
                        placeholder="Edge"
                        value={this.state.form.edge}
                        onChange={this.updateForm('edge')}
                      />
                    </label>
                  </div>
                  <div className="small-12 medium-4 columns">
                    <label>
                      Reaction
                      <input
                        type="number"
                        placeholder="Reaction"
                        value={this.state.form.reaction}
                        onChange={this.updateForm('reaction')}
                      />
                    </label>
                  </div>
                  <div className="small-12 medium-4 columns">
                    <label>
                      Intuition
                      <input
                        type="number"
                        placeholder="Intuition"
                        value={this.state.form.intuition}
                        onChange={this.updateForm('intuition')}
                      />
                    </label>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              {(this.state.errorEmptyForm) && (
                <div className="callout alert">
                  You must enter all fields or cancel.
                </div>
              )}

              <div className="button-group large expanded">
                <button
                  type="button"
                  className="button alert"
                  onClick={this.closeModal}
                >Cancel</button>

                <button
                  type="button"
                  className="button"
                  onClick={this.submitForm}
                >{(this.props.characterId) ? 'Save' : 'Create'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CharacterModal.propTypes = {
  characterId: PropTypes.string,
  onClose: PropTypes.func,

  // Characters HOC.
  charactersHoc: PropTypes.shape({
    list: PropTypes.object,
    createNewCharacter: PropTypes.func,
    updateStats: PropTypes.func,
  }),

  // ModalFoundation HOC
  modalFoundation: PropTypes.shape({
    hide: PropTypes.func.isRequired,
  }),
};

export default modalFoundation(MODAL_ID, modalOptions)(
  charactersHoc(
    CharacterModal
  )
);
