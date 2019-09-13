//LayoutButton.js
import React from 'react';

export default (props) => (
    <div>
           <button id="layoutButton" class="button hover" onClick={()=>{
               console.log('test', this.context.cy);
               this.context.cy.layout(props.opt).run();
           }}
           ><img src={props.img} alt="" />
               {props.name}
           </button>
       </div>
)



// const layoutButton = ({ nameOptImg }) => {
//     return (
//         <div>
//             <button id="layoutButton" class="button hover" onClick={()=>{
//                 console.log('test', this.context.cy);
//                 this.context.cy.layout(nameOptImg.opt).run();
//             }}
//             ><img src={nameOptImg.img} alt="" />
//                 {nameOptImg.name}
//             </button>
//         </div>
//     )
// }



// export default layoutButton;