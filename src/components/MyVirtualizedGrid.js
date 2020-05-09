import React from 'react';
import Grid from 'react-virtualized/dist/commonjs/Grid';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import data from '../data.json';
import './MyVirtualizedGrid.css';

// const list = [
//   ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 /* ... */],
// ];
const list = data;

class MyVirtualizedGrid extends React.Component {
  getItem = obj => {
    return (
      <div className="my-item">
        <div className="obj-name">{obj.name}</div>
        <div className="obj-gender">{obj.gender}</div>
        <div className="obj-company">{obj.company}</div>
      </div>
    );
  }

  cellRenderer = ({columnIndex, key, rowIndex, style}) => {
    return (
      <div key={key} style={style}>
        {this.getItem(list[rowIndex][columnIndex])}
      </div>
    );
  }

  getColumnWidth = ({index}) => {
    // if (index % 2 === 0) {
    //   return 60;
    // }
    return 100;
  }

  render() {
    return (
      <AutoSizer>
      { (params) => {
        const {width, height} = params;
        //console.log('params:', params);

        return (
        <Grid
          cellRenderer={this.cellRenderer}
          columnCount={list[0].length}
          columnWidth={this.getColumnWidth}
          height={height}
          rowCount={list.length}
          rowHeight={60}
          width={width}
        />
        )}
      }
      </AutoSizer>
    );
  }
}

export default MyVirtualizedGrid;