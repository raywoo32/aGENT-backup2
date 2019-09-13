import React, { Component } from "react";

export const Store = React.createContext();

class NetworkAppStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setStoreState : this.setStoreState.bind(this),
      cy : null,
      nodeNumChge: null,
      vennChange: false,
    };
  }

  setStoreState(key, value, fullObj = false) {
    fullObj ? this.setState(fullObj) : this.setState({[key]: value});
  };

  render() {
    return (
      // this.state more performant than creating new objects
      <Store.Provider value = {this.state}>
        {this.props.children}
      </Store.Provider>
    );
  }
}

export default NetworkAppStore;
