import classNames from 'classnames';
import React, {PropTypes} from 'react';

import charactersHoc from '../../hoc/characters.js';

import './initModifyList.scss';

/**
 * The list of modifiers.
 *
 * @type {Array.<{label: string, amount: number}>}
 */
const MODIFIER_LIST = [
  {label: 'Modify (-5)', amount: -5},
  {label: 'Modify (-10)', amount: -10},
  {divider: true},
  {label: 'Block (-5)', amount: -5},
  {label: 'Dodge (-5)', amount: -5},
  {label: 'Hit the Dirt (-5)', amount: -5},
  {label: 'Intercept (-5)', amount: -5},
  {label: 'Parry (-5)', amount: -5},
  {label: 'Full Defense (-10)', amount: -10},
];

/**
 * The InitModifyList component.
 */
export class InitModifyList extends React.Component {
  /**
   * @constructor
   * @param {{}} props
   * @param {{}} componentContext
   */
  constructor(props, componentContext) {
    super(props, componentContext);
  }

  /**
   * Triggered when the init is modified.
   *
   * @param {number} modifyAmount
   * @param {{preventDefault: function}} clickEvent
   */
  onModifyInit = (modifyAmount, clickEvent) => {
    clickEvent.preventDefault();

    this.props.charactersHoc.modifyInitiative(this.props.character.id, modifyAmount);
  };

  /**
   * Renders the component.
   *
   * @returns {{}}
   */
  render() {
    const character = this.props.character || {};
    const classes = classNames(
      'init-modify-list-component',
      'dropdown-pane right',
      {'dropdown-show': (this.props.show)}
    );

    return (
      <div className={classes}>
        <div className="modify-init-title">
          <h3 className="modify-init-label">Modify Init For {character.name}</h3>
        </div>
        <ul>
          {MODIFIER_LIST.map((modItem, itemIndex) => {
            if (modItem.divider) {
              return (
                <li className="modify-init-divider" key={itemIndex}>-</li>
              );
            }

            return (
              <li key={itemIndex}>
                <a onClick={this.onModifyInit.bind(this, modItem.amount)}>{modItem.label}</a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

InitModifyList.propTypes = {
  character: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,

  // Characters HOC.
  charactersHoc: PropTypes.shape({
    modifyInitiative: PropTypes.func,
  }),
};

export default charactersHoc(
  InitModifyList
);
