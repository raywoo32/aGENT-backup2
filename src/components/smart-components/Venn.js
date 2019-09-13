import * as venn from 'venn.js';
import * as d3 from 'd3';
import React, { Component } from 'react';
import {Store as NtwkCxt} from '../../react-context/NetworkAppStore';

class Venn extends Component {

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('prop', this.props.cyRef && this.props.cyRef.nodes().length);
    if (this.props.cyRef){
      var sets = [ {sets: ['A'], size: this.props.cyRef.nodes().length},
        {sets: ['B'], size: 12},
        {sets: ['A','B'], size: 2}];
      var chart = venn.VennDiagram().width(250).height(250);
      d3.select("#vennD3").datum(sets).call(chart);
    }
  }

  render() {
    return (
      <div id="vennD3"/>
    );
  }
}

Venn.contextType = NtwkCxt;

export default Venn;