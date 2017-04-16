import jQuery from 'jquery'; // eslint-disable-line no-shadow
import React, {PropTypes} from 'react';

import 'foundation-sites/dist/js/foundation.js';

/**
 * Defines the modal init parameters.
 *
 * @param {string} modalId
 * @param {{backdrop: (boolean|string), init: boolean, keyboard: boolean, show: boolean}=} modalOptions
 *
 * @returns {function}
 */
export default function modalFoundationInit(modalId, modalOptions) {
  /**
   * A higher order component wrapper that initializes a foundation modal.
   *
   * @param {Object} WrappedComponent
   * @returns {Object}
   */
  return function modalFoundation(WrappedComponent) {
    /**
     * The BootstrapModal higher order component.
     */
    class RawBootstrapModal extends React.Component {
      /**
       * @constructor
       * @param {{}} props
       * @param {{}} componentContext
       */
      constructor(props, componentContext) {
        super(props, componentContext);
      }

      /**
       * Fires when the component is going to mount.
       */
      componentWillMount() {
        // Register actions with the parent component if it asks for them.
        if (this.props.registerModalActions) {
          this.props.registerModalActions({
            hide: this.hideModal,
            show: this.showModal,
            toggle: this.toggleModal,
          });
        }
      }

      /**
       * Fires when the component mounts.
       */
      componentDidMount() {
        if (!modalOptions || modalOptions.init !== false) {
          this.initModal();
        }
      }

      /**
       * Parses the options.
       *
       * @returns {{close_on_background_click: boolean}|{}}
       */
      parseOptions = () => {
        const safeOptions = modalOptions || {};
        if (this.props.closeOnClick !== undefined) {
          safeOptions.closeOnClick = this.props.closeOnClick;
        }

        return safeOptions;
      };

      /**
       * Gets the modal object.
       *
       * @returns {{modal: function}}}
       */
      getModal = () => {
        return jQuery('#' + modalId);
      };

      /**
       * Hides the modal.
       */
      hideModal = () => {
        this.getModal().foundation('close');
      };

      /**
       * Initializes the modal with foundation modal options.
       */
      initModal = () => {
        new Foundation.Reveal(this.getModal(), this.parseOptions()); // eslint-disable-line no-new
      };

      /**
       * Show the modal.
       */
      showModal = () => {
        this.getModal().foundation('open');
      };

      /**
       * Toggles the modal.
       */
      toggleModal = () => {
        this.getModal().foundation('toggle');
      };

      /**
       * Renders the WrappedComponent.
       *
       * @returns {Object}
       */
      render() {
        const newProps = {
          modalFoundation: {
            hide: this.hideModal,
            init: this.initModal,
            show: this.showModal,
            toggle: this.toggleModal,
            registerActions: null,
          }
        };

        return <WrappedComponent {...this.props} {...newProps} />
      }
    }

    RawBootstrapModal.propTypes = {
      registerModalActions: PropTypes.func,
      closeOnClick: PropTypes.bool,
    };

    return RawBootstrapModal;
  };
}
