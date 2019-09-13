import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './components/smart-components/Home';
import 'normalize.css';
import 'font-awesome/css/font-awesome.min.css';
import {Route, HashRouter as Router, Switch} from 'react-router-dom';
import NotFound from './components/dummy-components/NotFound';
import NetworkAppStoreProvider from './react-context/NetworkAppStore';
import CytoscapeContainer from "./components/smart-components/CytoscapeContainer";
import setAlertify from './general-ui/alertify';
import ListGrNs from "./components/smart-components/ListGRNs";

const routes = (
  <Router>
    <>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/network/:networkId">
          <NetworkAppStoreProvider>
            <CytoscapeContainer/>
          </NetworkAppStoreProvider>
        </Route>
        <Route path="/list/:queryCategory/:name/:optnal2ndNm?" component={ListGrNs}/>
        <Route component={NotFound}/>
      </Switch>
    </>
  </Router>
);

/*
Test routes
Networks - http://localhost:3000/#/network/2284
*/

setAlertify();
ReactDOM.render(routes, document.getElementById('root'));