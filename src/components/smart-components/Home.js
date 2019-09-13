import React, { Component } from 'react';
import BarLogo from '../dummy-components/BarLogo';
import './smart-styles/Home.css';
import ReactSearchBox from 'react-search-box';
import agentLogo from '../../static-assets/aGENT-logo.svg';
import difference from "lodash.difference";

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {allTags: []}
  }

  async componentDidMount() {
    const TagsFetch = await fetch('http://www.mocky.io/v2/5d4cd4363300006b0033744e'); //todo change back to http://bar.utoronto.ca/interactions_api/tags
    if(!TagsFetch.ok) throw Error(TagsFetch.statusText);
    const TagsJSON = await TagsFetch.json();
    console.log(TagsJSON.data);
    const formattedTagsObj = [...new Set (TagsJSON.data.tags.split('|'))].map(i => {return {key: i, value: i}}); // remove any duplicates in tags and return a usable list for rea ct-select
    console.log('formattedTagsObj', formattedTagsObj);
    this.setState({allTags: formattedTagsObj})
  }

  render() {
    return (
      <div>
        <div className="home-bar-logo-div">
          <BarLogo/>
        </div>
        <div className="position-agent-logo">
          <img className="position-agent-logo" src={agentLogo} alt="AGENT"/>
        </div>
        <ReactSearchBox
          placeholder="Enter an AGI, AGI-pair, tissue or experiment type"
          data={this.state.allTags}
          fuseConfigs={{
            threshold: 0.0005,
          }}
          onSelect={record => this.props.history.push(`/list/tag/${record.value}`)}
          onKeyUp={value => {
            console.log(value.target.value);
            console.log(value.keyCode);
            if (value.keyCode === 13){
              if ( this.state.allTags.map(i=>i.key.toLowerCase()).includes(value.target.value.toLowerCase()) ){
                console.log('found!');
                this.props.history.push(`/list/tag/${value.target.value}`);
              }
              else if (value.target.value.includes("-")){
                const [AGI_1, AGI_2] = value.target.value.split('-');
                this.props.history.push(`/list/gene/${AGI_1}/${AGI_2}`);
              }
              else {
                this.props.history.push(`/list/gene/${value.target.value}`);
              }
            }
          }}
        />
      </div>
    );
  }
}

export default Home;
