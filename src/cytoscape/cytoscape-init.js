import * as cyCore from './cytoscape-core-fns';
import {locColorsHash, setInitLoadStyles as initStyle} from './cytoscape-styles';
import {geneSummPOST, SUBAPOST} from "../helper-fns/api-calls";

const {addNode, addEdge} = cyCore;

/**
 * Take in API data and perform basic graph rendering
 * @param {Object} cyto cytoscape instance reference
 * @param {Object} data loaded JSON interaction data
 * @param {boolean} firstInit whether or not if this call is the first cy init
 * @param {Object} store app store...use sparingly!
 */
export function cyJSONLoad (cyto, data, firstInit=false, store){
  data.forEach((item, i) =>{
    const id1 = item.entity_1.toUpperCase(), id2 = item.entity_2.toUpperCase(); // format all AGIs to become uppercase
    addNode(cyto, id1);
    addNode(cyto, id2);
    addEdge(cyto, id1, id2, item);
  });

  const repos = function (){
    for (var i = 0; i < cyto.nodes().length; i++) {
      // var a = cyto.nodes()[i];
      // console.log(a);
      // a.position({x: a.position().x * 2.75, y: a.position().y * 2.75});
      // cyto.zoom(0.75);
    }
  };

  const options = {name: 'breadthfirst', stop: repos, padding: 0}

  if (firstInit) {
    console.log(cyto.$('#AT5G66330'));
    cyto.layout(options).run();
    initStyle(cyto);
    addCyEvtEmitters(cyto, store);
    addCxtMenu(cyto, store);
  }

  cyCore.parseGeneNodes(cyto,(i)=>{console.log(i)}, false);
  initExtras(cyto);
}

/**
 * Once core network is loaded from interactions API - fetch in and load extras such as
 * gene annotations, SUBA (localization data), etc...
 * @param {Object} cyto cytoscape instance ref
 * @param {Array<string>} [onlyList=[]] only fetch these arr of AGIs (use case: when graph is already loaded, and user adds more genes)
 */
export function initExtras(cyto, onlyList=[]){
  let sendArr = [];
  if (onlyList.length === 0){
    cyCore.parseGeneNodes(cyto,(id)=>{sendArr.push(id)});
  }
  else {
    sendArr = onlyList;
  }
  // fire off independent, parallel promise
  initGeneAnnos(cyto, sendArr);
  initGeneSUBAs(cyto, sendArr);

}

/**
 * Promise to resolve to gene annotations, side effect of uploading 'symbol' data field to all AGI nodes
 * @param {Object} cyto cytoscape instance ref
 * @param {Array<string>} POSTListAGIs list of AGIs to POST
 * @returns {Promise<void>}
 */
async function initGeneAnnos(cyto, POSTListAGIs){
  try{
    const geneRes = await geneSummPOST(POSTListAGIs);
    if(!geneRes.ok) throw Error(geneRes.statusText);
    const annoNames = await geneRes.json();
    console.log(annoNames);

    Object.keys(annoNames).forEach((geneId)=>{
      cyto.$id(geneId).data({
        'symbol': annoNames[geneId].synonyms,
        'desc' : annoNames[geneId].brief_description
      });
    });
  }
  catch (e) {
    console.log(e) // TODO: handle error
  }
}

/**
 * Promise to resolve to SUBA values, side effect of uploading 'loc' data field to AGI nodes
 * @param {Object} cyto cytoscape instance ref
 * @param {Array<string>} POSTListAGIs list of AGIs to POST
 * @returns {Promise<void>}
 */
async function initGeneSUBAs(cyto, POSTListAGIs){
  try{
    const SUBARes = await SUBAPOST(POSTListAGIs);
    if(!SUBARes.ok) throw Error(SUBARes.statusText);
    const SUBAJSON = await SUBARes.json();
    console.log(SUBAJSON);

    Object.keys(SUBAJSON).forEach((geneId)=>{
      const majorityLocStr = Object.keys(SUBAJSON[geneId].data[0])[0];
      cyto.$id(geneId.toUpperCase()).data({
        loc       : majorityLocStr,
        locPercent: Object.values(SUBAJSON[geneId].data[0])[0] /
          SUBAJSON[geneId].data.reduce((acc, cur) => acc + Object.values(cur)[0], 0),
        allLocs   : SUBAJSON[geneId].data,
        locColor  : locColorsHash(majorityLocStr),
        expLocCSS : SUBAJSON[geneId].includes_experimental === "yes" ? "solid" : "dashed"
      });
    });
  }
  catch (e) {
    console.log(e) // TODO: handle error
  }
}

/**
 * Add event listeners to cytoscape graph to allow outside
 * communication to other libraries/visualizations...
 * i.e. implement an 'Observer Pattern'... Cytoscape <-> Store <-> Graphs(D3 etc)
 * @param cyto
 * @param appStore
 */
function addCyEvtEmitters(cyto, appStore){
  cyto.on('remove', function(e){
    console.log('removed!', e);
    // appStore.setStoreState('nodeNumChge', !appStore.nodeNumChge);
  });
}

function addCxtMenu(cyto, appStore){
  cyto.cxtmenu({
    selector: 'core',
    commands: [
      {
        content: 'delete <i class="fa fa-trash" aria-hidden="true"/>',
        select: function(eles){
          const removed = cyto.$('node:selected').remove();
          appStore.setStoreState('n/a','n/a',{
            'nodeNumChge': removed,
            'vennChange' : !appStore.vennChange,
          });
          console.log( 'bg1', console.log(eles) );
        }
      },
      {
        content: 'example Icon: ',
        select: function(){
          console.log( 'bg2' );
        }
      }
    ]
  });
}