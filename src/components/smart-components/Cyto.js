import React, {Component} from 'react';
import './smart-styles/Cyto.css';
import {cyJSONLoad} from '../../cytoscape/cytoscape-init';
import {intnsApi} from "../../helper-fns/api-calls";
import cytoSpread from 'cytoscape-spread';

import { withRouter } from 'react-router-dom';
import { GridLoader } from 'react-spinners';
import {Store as NtwkCxt} from '../../react-context/NetworkAppStore';
import {panAndZoom} from "../../cytoscape/cytoscape-core-fns";

import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import cxtmenu from 'cytoscape-cxtmenu';

cytoscape.use( coseBilkent );
cytoscape.use( cytoSpread );
cytoscape.use ( cxtmenu );

class CytoscapeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {ctrler: null, menuOpened: false};
  }

  componentDidMount() {
    this.fetchIntns(true);
  }


  componentDidUpdate(prevProps) {
    // initial render w/o prop change
    if(prevProps === undefined) {
      return false
    }

    const {ctrler} = this.state;
    const {networkId, cy } = this.context;

    // change URL to another network, prevent infinite loops
    if (networkId !== this.props.match.params.networkId){
      console.log('change url!', ctrler);
      ctrler && ctrler.abort();
      cy && cy.destroy(); // destroy cy instance, release memory
      this.fetchIntns(true);
    }

    if (prevProps.menuIsOpen !== this.props.menuIsOpen){
      const {cy} = this.context;
      if (this.props.menuIsOpen) panAndZoom(300, 0, cy, 1.1, false);
      else panAndZoom(-300, 0, cy, 1.1);
    }
  }

  componentWillUnmount(){
    this.cy && this.cy.destroy();
  }

  async fetchIntns(freshLoad){
    console.log(this.props.match);
    try {
      console.log(this.context);
      const ctrler = new AbortController(); // abort fetch controller
      this.setState({ctrler});
      this.context.setStoreState({},{},{
        networkId: this.props.match.params.networkId,
        dataLoaded : false,
      });
      const response = await intnsApi(this.props.match.params.networkId, {signal: ctrler.signal});
      if(!response.ok) throw Error(response.statusText);
      const json = await response.json();
      if(json.status !== 'success') throw Error('unsuccessful HTTP!');

      const cy = cytoscape({container: document.getElementById('cyApp')});

      const intrnData = json.data.interactions;
      console.log("JSON HERE \n \n", json)
      cyJSONLoad(cy, intrnData, freshLoad, this.context);
      this.context.setStoreState({},{},{cy, dataLoaded: intrnData});
    } catch (e) {
      console.log(e); // TODO: handle err
    }
  }


  render() {
    return (
      <>
        {!this.context.dataLoaded ?
          <>
            <GridLoader size={50} color={'#a4ca3f'}/>
            <p>Large networks will take longer to layout and load</p>
            <p>please do not press back!</p>
          </>
          :
          null
        }
        <div id='cyApp'/>
      </>
    );
  }
}

CytoscapeContainer.contextType = NtwkCxt;

export default withRouter(CytoscapeContainer);