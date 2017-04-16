import lodash from 'lodash';
import React, {PropTypes} from 'react';

import modalFoundation from '../../hoc/modalFoundation.js';
import charactersHoc from '../../hoc/characters.js';

import './initiativeModal.scss';

/**
 * Defines the id of the modal.
 * @type {string}
 */
const MODAL_ID = 'initiative-modal';

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
export class InitiativeModal extends React.Component {
  /**
   * @constructor
   * @param {{}} props
   * @param {{}} componentContext
   */
  constructor(props, componentContext) {
    super(props, componentContext);

    this.state = {
      form: this.reInitFormValues(props)
    };
  }

  /**
   * Triggered when the component in about to receive props.
   *
   * @param {{}} nextProps
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      form: this.reInitFormValues(nextProps)
    });
  }

  /**
   * Initializes the form state with each character id.
   *
   * @param {{characters: {list: {}}}} props
   * @returns {{}}
   */
  reInitFormValues = (props) => {
    return lodash.reduce(props.charactersHoc.list, (allChars, character) => {
      allChars[character.id] = character.rawInit || '';
      return allChars;
    }, {});
  };

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
      form: this.reInitFormValues(this.props),
    }, () => {
      this.props.modalFoundation.hide();
    });

    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  /**
   * Submits the change request form.
   *
   * @param {{preventDefault: function}} event
   */
  submitForm = (event) => {
    event.preventDefault();

    lodash.forEach(this.state.form, (value, characterId) => {
      const init = parseInt(value, 10) || 0;

      this.props.charactersHoc.restartInitiative(characterId, init);
    });

    if (this.props.onSubmit) {
      this.props.onSubmit();
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
              <h1>Initiatives</h1>
            </div>
            <div className="modal-body">
              <form className="form" onSubmit={this.submitForm}>
                {lodash.map(this.props.charactersHoc.list, (character) => {
                  return (
                    <div className="row" key={character.id}>
                      <div className="small-12 columns">
                        <label>
                          {character.name}
                          <input
                            type="number"
                            placeholder="Init Value"
                            value={this.state.form[character.id]}
                            onChange={this.updateForm(character.id)}
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </form>
            </div>
            <div className="modal-footer">
              <div className="button-group large expanded">
                <button
                  type="button"
                  className="button secondary"
                  onClick={this.closeModal}
                >Cancel</button>

                <button
                  type="button"
                  className="button"
                  onClick={this.submitForm}
                >Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

InitiativeModal.propTypes = {
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,

  // Characters HOC.
  charactersHoc: PropTypes.shape({
    list: PropTypes.object,
    restartInitiative: PropTypes.func,
  }),

  // ModalFoundation HOC
  modalFoundation: PropTypes.shape({
    hide: PropTypes.func.isRequired,
  }),
};

export default modalFoundation(MODAL_ID, modalOptions)(
  charactersHoc(
    InitiativeModal
  )
);
