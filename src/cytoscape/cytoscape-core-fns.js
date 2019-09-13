import {chkAndFltrForAGINames} from '../helper-fns/formatting-fns';

/**
 * Check if a node exists on cy core, if not add it with an ID (ideally an AGI) and an data flags
 * NB: Chose to add iteratively versus adding many nodes at once for simplicity, can be a micro-optimization in the future
 * @param {Object} cy cytoscape reference
 * @param {string} nodeId Id of the node
 * @param {Object} [extraData] an object containing custom data entries for the node
 * @returns {Object|null} the reference of the added node or null if already exists
 */
export function addNode(cy, nodeId, extraData) {
  if (cy.$id(nodeId).nonempty() ) return null;
  return cy.add([
    { group: 'nodes', data: { id: nodeId, name: `Gene_${nodeId}`, ...extraData} }
  ]);
}

/**
 * Check if an edge exists on cy core, if not add it with an ID and an data flags
 * @param {Object} cy cytoscape reference
 * @param {string} tgtNodeId node id of the SOURCE node
 * @param {string} srcNodeId node id of the TARGET node
 * @param {Object} [extraData] data entries in the edge itself
 * @returns {Object|null} the reference of the added edge or null if already exists
 */
export function addEdge(cy, tgtNodeId, srcNodeId, extraData){
  let edgeId = "";
  let edgeType = "";
  if (extraData.interaction_type_id === 1){
    edgeId = `ppi_${tgtNodeId}_${srcNodeId}`;
    edgeType = 'ppi';
  }
  else if (extraData.interaction_type_id === 2){
    edgeId = `pdi_${tgtNodeId}_${srcNodeId}`;
    edgeType = 'pdi';
  }
  else if (extraData.interaction_type_id === 3){
    edgeId = `mmi_${tgtNodeId}_${srcNodeId}`;
    edgeType = 'mmi';
  }
  if (cy.$id(edgeId).nonempty() ) return null;
  console.log(edgeId, tgtNodeId, srcNodeId);
  return cy.add([
    { group: 'edges', data:
        {
          id: edgeId, target: tgtNodeId, source: srcNodeId, edgeType, ...extraData
        }
    }
  ]);
}

/**
 * Pan Cy and set Zoom level
 * @param panX {number} - x coords
 * @param panY {number} - y coords
 * @param cy {Object} - cytoscape ref
 * @param zoomScale {number} - how much to scale current zoom
 * @param zoomIn {boolean} - zoom in or out (multiply or divide)
 */
export function panAndZoom(panX=0, panY=0, cy, zoomScale=1, zoomIn=true){
  const {x : curX, y: curY} = cy.pan();
  if (zoomIn){
    cy.panBy({x: panX, y: panY});
    const zmLvl = cy.zoom()*zoomScale;
    cy.zoom({
      level: zmLvl, // the zoom level
      renderedPosition: { x: cy.height()/2, y: cy.width()/2 }
    });
  }
  else {
    const zmLvl = cy.zoom()/zoomScale;
    cy.zoom({
      level: zmLvl, // the zoom level
      renderedPosition: { x: cy.height()/2, y: cy.width()/2 }
    });
    cy.panBy({x: panX, y: panY})
  }
}

/**
 * Parse through every protein (non-effector/non-miRNA) node that exists in the cy instance and perform the callback function on each node
 * @param {function} cb -  callback function
 * @param {boolean} [needNodeRef=false] - optional boolean to determine if callback should be performed on node object reference or just use nodeId
 */
export function parseGeneNodes(cy, cb, needNodeRef=false){
  cy.filter("node[name ^= 'Gene_']").forEach(function(node){
    let nodeID = node.id();
    if (chkAndFltrForAGINames(nodeID)) { //only get AGI IDs, exclude miRNAs, etc
      if (needNodeRef){
        cb(node);
      }
      else{
        cb(nodeID);
      }
    }
  });
}

/**
 * Parse through edges and perform some function 
 * @param {function} cb -  callback function
 */
export function parseEdges(cy, cb){
  cy.filter("edge").forEach(function(edge){
      cb(edge);
  });
}
