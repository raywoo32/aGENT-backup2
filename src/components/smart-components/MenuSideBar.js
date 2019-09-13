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
import {defaultOptions, cbOptions, spreadOptions, klayOptions, polywasOptions, cerebralOptions} from "../../cytoscape/cytoscape-layout.js" //layout options
import {getSif} from "./exportSif.js" //layout options
import '../dummy-components/dummy-styles/menuButton.css';
import '../dummy-components/dummy-styles/layoutButtons.css';
import axios from 'axios';
import Layout from "../dummy-components/menuSidebarButtons.js";
import defaultImgNameOpt from "../dummy-components/LayoutButton.js";
import cytoscape from 'cytoscape';
import klay from 'cytoscape-klay';
//import polywas from "./polywas-layout.js";
import 'jquery'; //maybe get rid of 
import layoutButton from '../dummy-components/LayoutButton.js';
import {loadJson, sif2Json} from "./sif2Json.js"
import {cyJSONLoad} from '../../cytoscape/cytoscape-init';


//cytoscape.use(polywas);
cytoscape.use( klay );

class MenuSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crntGRNDesc: undefined,
      crntGRNName: undefined,
      crntGRNTags: undefined,
      selectedFile: null,
      defaultImgNameOpt: []
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
        layoutButtonData: defaultImgNameOpt
      })
    }
    const scripts = ["http://code.jquery.com/jquery-2.0.3.min.js", 
               "http://cytoscape.github.io/cytoscape.js/api/cytoscape.js-latest/cytoscape.min.js",
               "./polywas-layout.js",
               "./cerebral.js", 
               "./layout.horizontal.js"
                ]
    for (var i=0; i<scripts.length; i++){
      var script = document.createElement("script");
      script.src = "https://use.typekit.net/foobar.js";
      script.async = true;
      document.body.appendChild(script);
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

  //Copied! https://stackoverflow.com/questions/44769051/how-to-upload-and-read-csv-files-in-react-js
  //https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/
  // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsBinaryString
  //https://stackoverflow.com/questions/28658388/filereader-result-return-null
  onChangeHandler= (event, cy, context) =>{ //ONLY TAKES A SINGLE FILE 
    console.log("FILE UPLOAD", event.target.files[0]) 
    var reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    reader.onload = function(e) {
      var string = reader.result;
      var json = sif2Json(string)
      console.log("CONVERTED TO JSON", json)
      cy && cy.destroy();
      console.log("destroyed") 
      // /https://blog.js.cytoscape.org/2016/05/24/getting-started/
      const cy2 = cytoscape({container: document.getElementById('cyApp'), elements: json.data.interactions});
      console.log("cy2 made")
      console.log("json interactions", json.data.interactions)
      //cyJSONLoad(cy2, json.data.interactions, false)
      //console.log("load json")
      //context.setStoreState({},{},{cy2, dataLoaded: json.data.interactions})   
      console.log("state") 
    }
  }

  render() {
    return (
      <Menu noOverlay onStateChange={this.props.onStateChange}>
        <script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>
        <script src="http://cytoscape.github.io/cytoscape.js/api/cytoscape.js-latest/cytoscape.min.js"></script>
        <script src="./polywas-layout.js"></script>
        
        <script type="text/javascript" charset="utf8" src="./cerebral.js"></script>
        <script type="text/javascript" charset="utf8" src="./layout.horizontal.js"></script>
                
        
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

          <VariableHeight title={"Layout"}>
          <button id="layoutButton" class="button hover" onClick={()=>{
              console.log('test', this.context.cy);
              this.context.cy.layout(defaultOptions).run();
            }}
            ><img src={Cerebral} alt="" />
            Default
          </button>
          <button id="layoutButton" class="button hover"  onClick={()=>{
              console.log('test', this.context.cy);
              this.context.cy.layout(cbOptions).run();
            }}
          ><img src={Cb} alt="" />
            Cose 
          </button>
          <button id="layoutButton" class="button hover"  onClick={()=>{
              console.log('test', this.context.cy);
              this.context.cy.layout(spreadOptions).run();
            }}
          ><img src={Spread} alt="" />
            Spread
          </button>
          <button id="layoutButton" class="button hover"  onClick={()=>{
              console.log('test', this.context.cy);
              this.context.cy.layout(klayOptions).run();
            }}
          ><img src={Spread} alt="" />
            Klay
          </button>
          <button id="layoutButton" class="button hover"  onClick={()=>{
              console.log('test', this.context.cy);
              this.context.cy.layout(polywasOptions).run();
              
            }}
          ><img src={Spread} alt="" />
            Chromosome
          </button>

          <button id="layoutButton" class="button hover"  onClick={()=>{
              console.log('test', this.context.cy);
              this.context.cy.layout(cerebralOptions).run();
              
            }}
          ><img src={Spread} alt="" />
            Cerebral
          </button>
          
          <div>
          <layoutButton name={this.state.defaultImgNameOpt.name} img={this.state.defaultImgNameOpt.img} opt={this.state.defaultImgNameOpt.opt}/>
          </div>

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

        <input type="file" accept='.sif' name="file" onChange={(event) => {
          this.onChangeHandler(event, this.cy, this.context)
          //})          //const cy = cytoscape({container: document.getElementById('cyApp')});
          //cyJSONLoad(cy, json.data.interactions, false, this.context)
          //this.context.setStoreState({},{},{cy, dataLoaded: json.data.interactions})      
        }}/>
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