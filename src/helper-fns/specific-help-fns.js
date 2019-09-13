export function parseGeneExprData(exprData, cytoRef){
  const dataAbsMax = 0;

  for (let geneExpKey of Object.keys(exprData)) {
    const  geneExp = exprData[geneExpKey];
    const expressionVal = geneExp.mean || geneExp.log_2_value || 0; //for abs, '0' in the JSON becomes 'undefined'

    console.log('here?');

    cytoRef.$id(geneExpKey)
      .data({
        absExpMn : expressionVal,
        absExpSd : geneExp.sd,
      });

    console.log(cytoRef.$id(geneExpKey).data());

  }

  cytoRef.style()
    .selector('node')
    .style({backgroundColor : "mapData(absExpMn, 0, 1000, yellow, red)"})
    .update()
}