import React, {Component} from 'react';
import {slide as Menu} from 'react-burger-menu'
import {Store as NtwkCxt} from '../../react-context/NetworkAppStore';
import './smart-styles/MenuSideBar.css';
import {withRouter} from 'react-router';
import BarLogo from '../dummy-components/BarLogo';
import VariableHeight from "../dummy-components/VariableCollapse";
import Venn from "./Venn";
import {fetchExprData} from "../../helper-fns/api-calls";
import {parseGeneExprData} from "../../helper-fns/specific-help-fns";

//Rachel Added
import Cerebral from "../dummy-components/cerebralLayoutIcon.svg";
import Cb from "../dummy-components/coseBilkentLayoutIcon.svg";
import Spread from "../dummy-components/spreadLayoutIcon.svg";
import {defaultOptions, cbOptions, spreadOptions} from "../../cytoscape/cytoscape-layout.js" //layout options
import {getSif} from "./exportSif.js" //layout options
import '../dummy-components/dummy-styles/menuButton.css';
import '../dummy-components/dummy-styles/layoutButtons.css';
import axios from 'axios';
import Layout from "../dummy-components/menuSidebarButtons.js";
import layoutButtonData from "../dummy-components/LayoutButton.js";


class MenuSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crntGRNDesc: undefined,
      crntGRNName: undefined,
      crntGRNTags: undefined,
      selectedFile: null,
      layoutButtonData: []
    }
  }
  
  componentDidMount() {
    console.log('cdm', this.props.location);
    const propLoc = this.props.location;
    if (propLoc && propLoc.state && propLoc.state.grnDesc) {
      this.setState({
        crntGRNDesc: propLoc.state.grnDesc,
        crntGRNName: propLoc.state.grnName,
        crntGRNTags: propLoc.state.grnTags,
        layoutButtonData: layoutButtonData
      })
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

  }

  //Rachel Added From: https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react
  //takes sif file as a string and downloads it as mySif.txt 
  downloadTxtFile = (sif) => {
    const element = document.createElement("a");
    const file = new Blob([sif], {type: "text/plain;charset=utf-8"});
    element.href = URL.createObjectURL(file);
    element.download = "grn.sif"; //TODO: SIF FILE AND NAME BETTER 
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  //Copied! 
  onChangeHandler=event=>{
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  }
  onClickHandler = () => {
    const data = new FormData()
    data.append('file', this.state.selectedFile)
    axios.post("http://localhost:8000/upload", data, { 
       // receive two    parameter endpoint url ,form data
   }).then(res => { // then print response status
     console.log(res.statusText)
  })
 }

 


  render() {
    return (
      <Menu noOverlay onStateChange={this.props.onStateChange}>
        <BarLogo/>
        <p>{this.state.crntGRNDesc}</p>
        <VariableHeight title={"Venn Count"}>
          <Venn cyRef={this.context.cy} nodeEvt={this.context.vennChange}/>
        </VariableHeight>
        <VariableHeight title={"Expression Overlay"}>
          <button onClick={()=>{
            console.log('test', this.context.cy.nodes());
            fetchExprData(this.context.cy)
              .then(res=>res.json())
              .then(res=> parseGeneExprData(res, this.context.cy))
          }}
          >Load Expression</button>
        </VariableHeight>
            <layoutButton layoutButtonData={this.state.layoutButtonData}/>

        <VariableHeight title={"Layout"}>
            
        </VariableHeight>

        <a id="home" className="menu-item" href="/">Home</a>
        <a id="about" className="menu-item" href="/about">About</a>
        <button id="menuButton" onClick={()=>{
          this.context.nodeNumChge.restore();
          this.context.setStoreState('vennChange', !this.context.vennChange)
        }}>Undo Delete</button>

        <button id="menuButton" onClick={()=>{
          var edges = this.context.cy.edges(); //TODO: generic edge function.  dummy for buttons 
          var stringSif = getSif(edges);
          this.downloadTxtFile(stringSif);
        }}>Download .Sif</button>
        <button id="menuButton" onClick={()=>{
        }}>Import .Sif</button>

        <input type="file" name="file" onChange={this.onChangeHandler}/>
        <button type="button" class="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button> 




      </Menu>
    );
  }
}

MenuSideBar.contextType = NtwkCxt;

export default withRouter (MenuSideBar);

// TODO: 
/*
1. implementing tool tips, hover over 
qtip, create tool tips over nodes, gene name, go term, 

POPPER js is the thing to use. //TOOL tips best practise.

Upload own sif file, view and display, 
accept a .sif file of 
can you reproduce 

upload sif file to app, can you create a network that is the same as the one from the database

Look at 

When yu initialize a network, cytoscape-init.js. 
Run the same thing and load it from the person's sif file. 
Create a button that looks nice or dropdown netowork 
export import button react and css. Use illustratro to be swanky, 

FONT AWESOME look for icons 

ALSO. export function syJSONLOad, cyto, dat, first init=false
1. reformatt from sif to json then use function 
2. Use cyto,json.load()
3. also destroy the other network 
cy.destory()

REFACTOR. parse edges function(), component for buttons layouts 
Research layouts 
Uplod network file. 

example network, accept either json or sif in export 
show the example of how a good sif or how a good json looks 

API for names of genes, to add. 
convert the data into a usable json
developertools and f
*/