import React, {Component} from 'react';
import './smart-styles/CytoscapeContainer.css';

import Cyto from './Cyto';
import MenuSideBar from './MenuSideBar.js';
import alertify from "alertifyjs";
import fitGIF from '../../static-assets/fitGraph.gif';


class CytoscapeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {menuOpened: false, alerted: false};
    this.isMenuOpen = this.isMenuOpen.bind(this);
  }

  isMenuOpen (menuState) {
    console.log('open or closed?', menuState, menuState.isOpen);
    menuState.isOpen && !this.state.alerted && alertify.warning('<img src=' + fitGIF + ' alt="">');
    this.setState({menuOpened: menuState.isOpen, alerted: true});
    return menuState.isOpen;
  };

  render() {
    return (
      <>
        <MenuSideBar onStateChange={this.isMenuOpen}/>
        <Cyto menuIsOpen={this.state.menuOpened}/>
      </>
    );
  }
}

export default CytoscapeContainer;