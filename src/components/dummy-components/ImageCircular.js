import React from 'react';
import './dummy-styles/ImageCircular.css';
import Tippy from '@tippy.js/react';
import 'tippy.js/themes/light-border.css'

export default (props)=>(
  <div /*className="image-cropper"*/>
    <a rel="noreferrer noopener" target="_blank" href={props.imageURL}>
      <Tippy
        content={<span><img className="tippy-hover-image" alt="Paper Network Full" src={props.imageURL}/></span>}
        theme="light-border"
        arrow
        hideOnClick={false}
        distance={20}
        interactive={true}
        delay={350}
      >
        <img className="grn-image" alt="Paper Network" src={props.imageURL}/>
      </Tippy>
    </a>
  </div>
)