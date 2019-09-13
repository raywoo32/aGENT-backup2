/* cytoscape-layout.js
Records the default options for the different layouts for the cytoscape object. 
All options are exported and called in MenuSideBar.js
@author: Rachel Woo 
*/
    
import Cerebral from "../components/dummy-components/cerebralLayoutIcon.svg";
import Cb from "../components/dummy-components/coseBilkentLayoutIcon.svg";
import Spread from "../components/dummy-components/spreadLayoutIcon.svg";

const defaultOptions = {
    name: 'breadthfirst', 
    stop: undefined, 
    padding: 0
};
const cbOptions =  {
  name: 'cose-bilkent',
  nodeDimensionsIncludeLabels: false,
  refresh: 30,
  fit: true,
  padding: 10,
  randomize: false,
  nodeRepulsion: 4500,
  idealEdgeLength: 50,
  edgeElasticity: 0.45,
  nestingFactor: 0.1,
  gravity: 0.25,
  numIter: 2500,
  tile: true,
  animate: true,
  tilingPaddingVertical: 10,
  tilingPaddingHorizontal: 10,
  gravityRangeCompound: 1.5,
  gravityCompound: 1.0,
  gravityRange: 3.8,
  initialEnergyOnIncremental: 0.5
};
const spreadOptions = {
  name: 'spread',
  prelayout: false, 
  animate: true, // Whether to show the layout as it's running
  ready: undefined, // Callback on layoutready
  stop: undefined, // Callback on layoutstop
  fit: true, // Reset viewport to fit default simulationBounds
  minDist: 20, // Minimum distance between nodes
  padding: 20, // Padding
  expandingFactor: -1.0, // If the network does not satisfy the minDist
  maxExpandIterations: 4, // Maximum number of expanding iterations
  boundingBox: undefined, // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  randomize: false // Uses random initial node positions on true
};

var klayOptions = {
  name: 'klay',
  nodeDimensionsIncludeLabels: false, 
  fit: true,
  padding: 20,
  animate: false, 
  animateFilter: function( node, i ){ return true; }, 
  animationDuration: 500, 
  animationEasing: undefined, 
  transform: function( node, pos ){ return pos; }, 
  ready: undefined, 
  stop: undefined, 
  klay: {
    addUnnecessaryBendpoints: false, // Adds bend points even if an edge does not change direction.
    aspectRatio: 1.6, // The aimed aspect ratio of the drawing, that is the quotient of width by height
    borderSpacing: 20, // Minimal amount of space to be left to the border
    compactComponents: false, // Tries to further compact components (disconnected sub-graphs).
    crossingMinimization: 'LAYER_SWEEP', // Strategy for crossing minimization.
    cycleBreaking: 'GREEDY', // Strategy for cycle breaking. Cycle breaking looks for cycles in the graph and determines which edges to reverse to break the cycles. Reversed edges will end up pointing to the opposite direction of regular edges (that is, reversed edges will point left if edges usually point right).
    direction: 'UNDEFINED', // Overall direction of edges: horizontal (right / left) or vertical (down / up)
    edgeRouting: 'ORTHOGONAL', // Defines how edges are routed (POLYLINE, ORTHOGONAL, SPLINES)
    edgeSpacingFactor: 0.5, // Factor by which the object spacing is multiplied to arrive at the minimal spacing between edges.
    feedbackEdges: false,
    fixedAlignment: 'NONE', 
    inLayerSpacingFactor: 1.0, // Factor by which the usual spacing is multiplied to determine the in-layer spacing between objects.
    layoutHierarchy: false, // Whether the selected layouter should consider the full hierarchy
    linearSegmentsDeflectionDampening: 0.3, // Dampens the movement of nodes to keep the diagram from getting too large.
    mergeEdges: false, // Edges that have no ports are merged so they touch the connected nodes at the same points.
    mergeHierarchyCrossingEdges: true,
    nodePlacement:'BRANDES_KOEPF', 
    randomizationSeed: 1, 
    routeSelfLoopInside: false, 
    separateConnectedComponents: true, 
    spacing: 20, 
    thoroughness: 7 
  },
  priority: function( edge ){ return null; }, // Edges with a non-nil value are skipped when geedy edge cycle breaking is enabled
};

const polywasOptions = {
  name:'polywas',
  padding: 100, // Padding around the layout
  boundingBox: undefined, // Constrain layout bounds; {x1,y1,x2,y2} or {x1,y1,w,h}
  chromPadding: 5, // Ammount of padding at the end of the chrom lines in degrees
  nodeDiameter: 30, // Diameter of the genes, for stacking and spacing
  radWidth: 0.015, // Thickness of the Chromosomes lines (in radians)
  logSpacing: false, // Log or linear SNP layout along Chromosome
  snpLevels: 3, // How many colors to stripe the SNPs
}

const cerebralOptions = {
  name:'cerebral',
  padding: 100, // Padding around the layout
}

const defaultImgNameOpt = [
  {name: "Default", img : Cerebral, opt: defaultOptions},
]

//  {name: "Cose", img : Cb, opt: cbOptions}, {name: "Spread", img : Spread, opt: spreadOptions}

export {
    spreadOptions, cbOptions, defaultOptions, defaultImgNameOpt, klayOptions, polywasOptions, cerebralOptions
}

