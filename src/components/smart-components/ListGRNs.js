import React, {Component} from 'react';
import BarLogo from '../dummy-components/BarLogo';
import NetworkCard from '../dummy-components/NetworkCard';
import {ClipLoader, ScaleLoader} from 'react-spinners';
import {fetchGRNs} from '../../helper-fns/api-calls';
import makeAnimated from 'react-select/animated';
import chroma from 'chroma-js';
import Select, {components} from 'react-select';
import difference from 'lodash.difference';
import {tagColorMap} from '../../helper-fns/dictionaries'
import './smart-styles/ListGRNs.css';
import chevron from '../../static-assets/caret-down-solid-fontawesome.svg';
import agentLogo from '../../static-assets/aGENT-logo.svg';


const animatedComponents = makeAnimated();

const formatGroupLabel = data => (
  <div className="tag-groups-in-select">
    <span className="tag-group-name">{data.label}</span>
    <span className="group-badge-GRN-list">{data.options.length}</span>
  </div>
);

class ListGrNs extends Component {
  constructor(props) {
    super(props);
    this.state = {GRNs: null, tags: [], filters: []}
  }

  handleChange = (selectedOption) => {
    if (selectedOption === null){ // conditional if only one tag is cleared
      this.setState({ filters:[]})
    }
    else {
      this.setState({ filters : selectedOption.map(opt=>(opt.value)) });
    }
    console.log(`Option selected:`, selectedOption);
  };

  componentWillMount() {
    document.body.style.backgroundColor = "#f8f8f8";
  }

  componentWillUnmount() {
    document.body.style.backgroundColor = null;
  }

  async componentDidMount() {
    console.log('all params', this.props.match.params);
    console.log('params', this.props.match.params.AGI);
    const GRNListFetch = await fetchGRNs(this.props.match.params);
    if(!GRNListFetch.ok) throw Error(GRNListFetch.statusText);
    let GRNList = await GRNListFetch.json();
    GRNList = GRNList.data;
    console.log("GRNs", GRNList);
    let tagsFltrd = [];
    const groupedOptions = [
      { label: 'Experiments', options: []},
      { label: 'Conditions', options: []},
      { label: 'Genes', options: []},
      { label: 'Misc', options: []}
    ];
    GRNList.map(GRN => {
      tagsFltrd = tagsFltrd.concat(difference(GRN.tags.split('|'), tagsFltrd));
    });
    tagsFltrd.forEach(tag => {
      const tagGrpArr = tag.split(':');
      const option = {value: tagGrpArr[0], label: tagGrpArr[0], color : tagColorMap[tagGrpArr[1]]};
      if (tagGrpArr[1] === 'Experiment') groupedOptions[0].options.push(option);
      else if (tagGrpArr[1] === 'Condition') groupedOptions[1].options.push(option);
      else if (tagGrpArr[1] === 'Gene') groupedOptions[2].options.push(option);
      else if (tagGrpArr[1] === 'Misc') groupedOptions[3].options.push(option);
    });
    console.log(tagsFltrd);
    this.setState({GRNs: GRNList, tags: groupedOptions});
  }
//creat dummy component based on props( arg to react com), change how button looks
//reusable, go to component file, not in SEE EXAMPLE BELOW TODO:
//TODO: export more layout, custom illustrator images. 
// 1. cose, breadthfirst, SEE BY WEEKEND, circle, NOT grid, Look at extensions. COLA, EULER, SPREAD, dagger
// parse nodes, push list of localization, put notes inside parent nodes

  render() {
    let listItems;
    if (this.state.GRNs){
      listItems = this.state.GRNs.map((GRN) => {
        const tagsClean = GRN.tags.split('|').map(tag=>tag.split(':')[0]);
        if (difference(this.state.filters, tagsClean).length === 0){
          return <NetworkCard
            key={GRN.source_id}
            sourceId={GRN.source_id}
            name={GRN.grn_title}
            desc={GRN.comments}
            tags={GRN.tags}
            imageURL={GRN.image_url}
          />
        }
      });
    }
    else {
      listItems = <ClipLoader/>; //todo; optimize look and feel of loader
    }

    return (
      <div>
        <div className="logo-nm-slt-flxbx">
          <img width="80px" src={agentLogo} alt="AGENT"/>
          {this.props.match.params.AGI}
          <Select
            isMulti
            // menuIsOpen

            formatGroupLabel={formatGroupLabel}

            styles={rtSltStylesAPI}
            components={{animatedComponents, DropdownIndicator}}
            className='tags-react-select-container'
            classNamePrefix="react-select-option"
            placeholder="Filter Networks by Tag"
            onChange={this.handleChange}
            options={this.state.tags}
          />
          <BarLogo/>
        </div>
        {listItems}
      </div>
    );
  }
}

export default ListGrNs;

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img className="rt-slt-chevron" src={chevron} alt="arrow-down"/>
    </components.DropdownIndicator>
  );
};

const rtSltStylesAPI = { // set styling for options colours, see stylesheet for more
  control: styles => ({ ...styles, backgroundColor: '#f2f2f2' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
          ? data.color
          : isFocused
            ? color.alpha(0.1).css()
            : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  }),
};