/* exportSif.js
Called onClick of "Download Raw" in MenuSideBar.ls
Loops over edges of cytoscape object to reconstruct the sif associated with it. 

@author: Rachel Woo 
*/

import {parseEdges} from '../../cytoscape/cytoscape-core-fns'

/**
 * Gets the .sif file as a string corresponding to the grn in cy
 * @param  {cy} cytoscape object
 * @return {String} string formatted as .sif file as defined by documentation
 */
function getSif(cy) {
    const sources = [];
    const types = [];
    const targets = [];
    var edges = cy.edges(); 
    parseEdges(cy,(edges)=>{for (var i=0; i < edges.length; i++){ sources.push(edges[i].data("source"))}}); 
    parseEdges(cy,(edges)=>{for (var i=0; i < edges.length; i++){ types.push(edges[i].data("edgeType"))}}); 
    parseEdges(cy,(edges)=>{for (var i=0; i < edges.length; i++){ targets.push(edges[i].data("target"))}}); 
    
    var sif = "";
    for (var i = 0; i < edges.length; i++) {
         var line = sources[i] + "\t" + types[i] + "\t" + targets[i] + "\n";
          sif = sif + line; 
    }
    return sif; 
}


export {
    getSif
}