/**
 * API to the network requested by user
 * @param networkId {number} should be url param network id
 * @param signal {Object} *EXPERIMENTAL* fetch signal for aborting
 * @returns {Promise<Response>}
 */
import {parseGeneNodes} from "../cytoscape/cytoscape-core-fns";

export function intnsApi(networkId, signal){
  return fetch(`http://bar.utoronto.ca/interactions_api/papers/${networkId}/interactions`, signal);
}

/**
 * API to the gene summaries which will return AGI names and short descs
 * @param genesArr {Array<string>} - list of AGIs (nothing else!)
 * @returns {Promise<Response>}
 */
export function geneSummPOST(genesArr){
  return fetch('http://bar.utoronto.ca/interactions2/cgi-bin/gene_summaries_POST.php', {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify(genesArr)
    });
}

export function SUBAPOST(genesArr){
  return fetch('https://bar.utoronto.ca/~vlau/suba4.php',{
    method : 'POST',
    headers : {
      'Content-Type' : 'application/json',
    },
    body : JSON.stringify({
      AGI_IDs: genesArr,
      include_predicted: true
    })
  });
}

/**
 * Based on the query parameters, namely the 'queryCategory' and 'name', return the correct URL (and ultimately, the correct SQL query) to fetch a list of GRNs from
 * @param queryParamObj
 * @returns {Promise<Response>}
 */
export function fetchGRNs(queryParamObj){
  return fetch('http://www.mocky.io/v2/5d5469102f00000e008615dd'); // todo: remove
  if (queryParamObj.queryCategory === "gene") {
    return fetch(`http://bar.utoronto.ca/interactions_api/gene/${queryParamObj.name}`)
  }
  else if (queryParamObj.queryCategory === "tag"){
    return fetch(`http://bar.utoronto.ca/interactions_api/tags/${queryParamObj.name}`)
  }
  else if (queryParamObj.queryCategory === "pair"){
    return fetch(`http://bar.utoronto.ca/interactions_api/gene/${queryParamObj.name}/${queryParamObj.optnal2ndNm}`)
  }
}


// TODO: modify this later
export function fetchExprData(cyto){

  const strgAGIArr = [];

  parseGeneNodes(cyto, node=>{strgAGIArr.push(node.data('id'));}, true);

  console.log(strgAGIArr);

  return fetch('https://bar.utoronto.ca/interactions2/cgi-bin/getSample.php', {
    method : 'POST',
    headers : {
      'Content-Type' : 'application/json',
    },
    body : JSON.stringify({
      "geneIDs": strgAGIArr, // ["at4g24470", ...]
      "species":"arabidopsis",
      "inputMode":"absolute",
      "dataSource":"Abiotic_Stress_II",
      "tissue":"Non Stressed (control), Polysomal RNA","tissuesCompare":""
    })
  });
}