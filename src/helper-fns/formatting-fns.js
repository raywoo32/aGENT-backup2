/**
 * Given a string of putative AGI or list of strings, check if it is an AGI, or filter for AGIs respectively
 * @param listOfAGIsorAGI {string, Array<string>} AGIs
 * @returns {boolean, Array<string>}
 */
export function chkAndFltrForAGINames(listOfAGIsorAGI){
  if (typeof listOfAGIsorAGI === "string"){
    return !!listOfAGIsorAGI.match(/^AT[1-5MC]G\d{5}$/i);
  }
  else if (Array.isArray(listOfAGIsorAGI)){
    return Array.from(new Set(listOfAGIsorAGI.filter(i=>(i.match(/^AT[1-5MC]G\d{5}$/i))))); // new Set to remove duplicates
  }
}