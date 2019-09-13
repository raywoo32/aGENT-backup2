import {Collapse} from 'react-collapse';
import React from 'react';
import './dummy-styles/VariableCollapse.css';

class VariableHeight extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {isOpened: false};
  }


  render() {
    const {isOpened} = this.state;

    return (
      <div>

        <p onClick={
          ()=> {this.setState({isOpened: !this.state.isOpened})}} className="hover-menu-title">
        {this.props.title}
        </p>

        <Collapse isOpened={isOpened}>
          {this.props.children}
        </Collapse>

      </div>
    );
  }
}

export default VariableHeight;