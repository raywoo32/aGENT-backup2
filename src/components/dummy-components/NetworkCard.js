import React from 'react';
import './dummy-styles/NetworkCard.css';
import ImageCircle from "./ImageCircular";
import Tippy from '@tippy.js/react';
import 'tippy.js/themes/light-border.css';
import { withRouter } from 'react-router';

export default withRouter ((props)=>(
  <div className="ntwrk-cd">
    <div className="ntwrk-cd-grid">
      <ImageCircle className="ntwrk-cd-img-circ" imageURL={props.imageURL}/>
      <div>
        <div
          className="netwrk-info"
          onClick={()=>props.history.push({
            pathname: `/network/${props.sourceId}`,
            state: {
              grnDesc: "test",
              grnName: "testname",
              grnTags: "testtags"
            }
          })}
        >
          <h2
            className="ntwrk-cd-title"
          >
            {props.name}
          </h2>
          <Tippy
            content={props.desc}
            theme="light-border"
            followCursor
            arrow
            hideOnClick={false}
            distance={20}
            interactive={true}
            delay={225}
          >
            <h4 className="netwrk-cd-desc">{props.desc}</h4>
          </Tippy>
        </div>
        <div className="netwrk-cd-tags-flxbx">{
          props.tags.split('|').sort(tagSortingFn).map(tag=>{
            const [tagValue, tagGrp] = tag.split(':');
            return <div className={`netwrk-cd-tag ${tagGrp}`} key={tagValue}>{tagValue}</div>
          })
        }</div>
      </div>
    </div>
    <hr/>
  </div>
))

const tagSortingFn = (tagA, tagB) => {
  const grpA = tagA.split(':')[1], grpB = tagB.split(':')[1];
  const valueDict = {"Experiment" : 1, "Condition": 2, "Gene": 3, "Misc": 4};
  return valueDict[grpA] - valueDict[grpB];
};