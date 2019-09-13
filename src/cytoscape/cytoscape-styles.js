import {localizationMap} from "../helper-fns/dictionaries";

/**
 * Take in cytoscape instance and set a baseline style
 * @param {Object} cy cytoscape reference
 */
export function setInitLoadStyles(cy){
  cy.style()
    .selector('edge[edgeType = "pdi"]') // default PDI style
      .style({
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle-backcurve',
      })
    .selector('node')
      .style({
        'width' : 20,
        'height': 20,

        'label': (el)=>
          (typeof el.data('symbol') === "undefined" ? "" :
            el.data('symbol')[0] ? el.data('symbol')[0] : "") + '\n' + el.data('id'),
        "font-size" : 5,
        "text-background-opacity": 1,
        "color": "#fff",
        "text-background-color": "#888",
        "text-background-shape": "roundrectangle",
        "text-border-color": "#000",
        "text-border-width": 0.75,
        "text-border-opacity": 1,
        "text-valign": "center",
        "text-halign": "center",
        "text-wrap" : "wrap",

        "border-color" : "data(locColor)",
        "border-width" : "mapData(locPercent, 0, 1, 0, 2)",
        "border-style" : "data(expLocCSS)",

      })
    .selector('node:selected')
      .style({
        'background-color' : 'turquoise',
      })
    .update()
}

export function locColorsHash(localization){
  return localizationMap[localization];
}