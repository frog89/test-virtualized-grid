import React, { Component } from 'react';
import MyVirtualizedGrid from './MyVirtualizedGrid';
import MyVirtualizedTable from './MyVirtualizedTable';
import MyFeatureTable from './MyFeatureTable';
import MyDynamicColumnTable from './MyDynamicColumnTable';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-virtualized/styles.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="my-outer-container">
        <div className="my-inner-container">
          <Tabs defaultActiveKey="dyn-table">
            <Tab eventKey="virt-table" title="Virtualized Table">
              <div className="my-tab-container">
                <div className="my-tab-header">
                  Virtualized Table
                </div>
                <div className="my-tab-content">
                  <MyVirtualizedTable/>
                </div>
              </div>
            </Tab>
            <Tab eventKey="virt-feature-table" title="Virtualized Featured Table">
              <div className="my-tab-container">
                <div className="my-tab-header">
                  Virtualized Featured Table
                </div>
                <div className="my-tab-content">
                  <MyFeatureTable/>
                </div>
              </div>
            </Tab>
            <Tab eventKey="dyn-table" title="Virtualized Dynamic Table">
              <div className="my-tab-container">
                <div className="my-tab-header">
                  Virtualized Dynamic Table
                </div>
                <div className="my-tab-content">
                  <MyDynamicColumnTable/>
                </div>
              </div>
            </Tab>
            <Tab eventKey="sort-table" title="Virtualized Grid">
              <div className="my-tab-container">
                <div className="my-tab-header">
                  Virtualized Grid
                </div>
                <div className="my-tab-content">
                  <MyVirtualizedGrid />
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default App;
