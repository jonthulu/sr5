import React, {PropTypes} from 'react';

import modalFoundation from '../../hoc/modalFoundation.js';

import './genericAlertModal.scss';

/**
 * Defines the id of the modal.
 * @type {string}
 */
const MODAL_ID = 'generic-alert-modal';

/**
 * Modal Options.
 *
 * @type {{closeOnClick: boolean}}
 */
const modalOptions = {
  closeOnClick: false,
};

/**
 * The generic alert modal.
 */
export class GenericAlertModal extends React.Component {
  /**
   * @constructor
   * @param {{}} props
   * @param {{}} componentContext
   */
  constructor(props, componentContext) {
    super(props, componentContext);
  }

  /**
   * Closes the modal.
   */
  closeModal = () => {
    this.props.modalFoundation.hide();
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
            {(this.props.title) && (
              <div className="modal-header">
                <h1>{this.props.title}</h1>
              </div>
            )}

            {(this.props.children) && (
              <div className="modal-body">
                {this.props.children}
              </div>
            )}

            <div className="modal-footer">
              <button type="button" className="button" onClick={this.closeModal}>Ok</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

GenericAlertModal.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,

  // ModalFoundation HOC
  modalFoundation: PropTypes.shape({
    hide: PropTypes.func.isRequired,
  }),
};

export default modalFoundation(MODAL_ID, modalOptions)(
  GenericAlertModal
);
