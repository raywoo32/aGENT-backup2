/* sif2Json.js

For importing a sif from a user. Converts .sif to .json, then implements upload 

@author: Rachel Woo 
*/

//import React from 'react';
import './smart-styles/Cyto.css';
import {cyJSONLoad} from '../../cytoscape/cytoscape-init';
//import cytoSpread from 'cytoscape-spread';

import cytoscape from 'cytoscape';
//import coseBilkent from 'cytoscape-cose-bilkent';
//import cxtmenu from 'cytoscape-cxtmenu';

//cytoscape.use( coseBilkent );
//cytoscape.use( cytoSpread );
//cytoscape.use ( cxtmenu );

var fs = require('fs') //for sif2Json

//IN PROGRESS 
export function loadJson(json) {
                try {
                        this.cy && this.cy.destroy();
                        const cy = cytoscape({container: document.getElementById('cyApp')});
                        cyJSONLoad(cy, json.data.interactions, false, this.context)
                        this.context.setStoreState({},{},{cy, dataLoaded: json.data.interactions})        
                }
                catch (e) {
                        console.log(e); // TODO: handle err
                }
        }
      

/** DOES NOT WORK IN BROWSER, change from fs to REACT from import button 
 * Takes a sif as a string and returns Json in success and -1 in failure 
 * @param  {string} sif file as string
 * @return {Json | -1} returns cytoscape json object or -1 if failure occurs 
 */
export function sif2Json(file) { 
        //var sif = fs.readFileSync(filepath)
        var sifByLine = file.toString().split("\n");
        var json = {};
        var data = {};
        var interactions = [];

        //iterate over lines in .sif file
        var count = 0
        for (var line of sifByLine) {
                if (line.length === 0 || line[0] === "#" || line[0] === "-"){
                        continue; //empty line is fine 
                }
                var lineSplit = line.trim().split(/(\s+)/)
                if (lineSplit.length !== 5) {
                        console.log("bad sif upload attempted");
                        break;
                }
                var interaction = {
                        entity_1: lineSplit[0], 
                        entity_2: lineSplit[4].split("|")[0],
                        interaction_id: count, //arbitrarily count 
                        interaction_type_id: getItrnIdx(lineSplit[2].split("-")[0]), 
                        pearson_correlation_coeff: null
                };
                interactions.push(interaction)       
                count = count + 1       
        }
        data["interactions"] = interactions;
        json["data"] = data;
        return json;
}

function getItrnIdx (AIVIndex) {
        return {
        'ppi' : 1,
        'pdi' : 2,
        'mmi' : 3
        }[AIVIndex]
      }



//Citations 
/*

https://stackoverflow.com/questions/34385499/how-to-create-json-object-node-js
https://stackoverflow.com/questions/40317668/loading-and-using-json-for-cytoscape-js
https://medium.com/@ilonacodes/front-end-shorts-how-to-read-content-from-the-file-input-in-react-17f49b293909
https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/

*/