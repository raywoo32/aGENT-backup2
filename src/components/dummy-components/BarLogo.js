import React from 'react';

export default ()=>{
 if (window.self === window.top){ // iFrame check (don't display BAR logo when apart of ePlant)
   return (
     <a rel="noreferrer noopener" target="_blank" href="http://bar.utoronto.ca">
       <img
         style={
           {filter: 'drop-shadow(2px 2px 2px #222)'}
         }
         alt="bar logo"
         src="http://bar.utoronto.ca/BAR/images/BAR.png"
       />
     </a>
   )
 }
 else { return null}
}
