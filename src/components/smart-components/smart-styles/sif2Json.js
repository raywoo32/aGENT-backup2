/* sif2Json.js

For importing a sif from a user. Converts .sif to .json, then implements upload 

@author: Rachel Woo 
*/

import {cyJSONLoad, initExtras} from '~/src/cytoscape/cytoscape-init.js'
var fs = require('fs'); //for sif2Json


//IN PROGRESS 
async loadJson(json) {
        try {
                cyJSONLoad(cy, json.data.interactions, false, this.context)
                this.context.setStoreState({},{},{cy, dataLoaded: json.data.interactions})        
        }
        catch (e) {
                console.log(e); // TODO: handle err
        }
}

/** TESTED! WORKS
 * Takes a sif filepath and returns Json in success and -1 in failure 
 * @param  {filepath} path to sif file
 * @return {Json | -1} returns cytoscape json object or -1 if failure occurs 
 */
function sif2Json(filepath) {
        var sif = fs.readFileSync(filepath)
        var sifByLine = sif.toString().split("\n");
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
        console.log(json)
        return json;
}

function getItrnIdx (AIVIndex) {
        return {
        'ppi' : 1,
        'pdi' : 2,
        'mmi' : 3
        }[AIVIndex]
      }


export { displayJson, sif2Json,  }

//Citations 
/*

https://stackoverflow.com/questions/34385499/how-to-create-json-object-node-js
https://stackoverflow.com/questions/40317668/loading-and-using-json-for-cytoscape-js


 {
    "nodes": [
            {
            "data": {"id": "a", "label": "Gene1"}
            },
            {
            "data": {"id": "b", "label": "Gene2"}
            },
            {
            "data": {"id": "c", "label": "Gene3"}
            },
            {
            "data": {"id": "d", "label": "Gene4"}
            },
            {
            "data": {"id": "e", "label": "Gene5"}
            },
            {
            "data": {"id": "f", "label": "Gene6"}
            }
    ],
            "edges": [
            {
            "data": {
            "id": "ab",
                    "source": "a",
                    "target": "b"
            }
            },
            {
            "data": {
            "id": "cd",
                    "source": "c",
                    "target": "d"
            }
            },
            {
            "data": {
            "id": "ef",
                    "source": "e",
                    "target": "f"
            }
            },
            {
            "data": {
            "id": "ac",
                    "source": "a",
                    "target": "d"
            }
            },
            {
            "data": {
             "id": "be",
                    "source": "b",
                    "target": "e"
                }
                }]    
    }
*/

