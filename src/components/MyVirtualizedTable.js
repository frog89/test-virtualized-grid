import React from 'react';
import Table from 'react-virtualized/dist/commonjs/Table';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Column } from 'react-virtualized/dist/commonjs';
import data from '../data.json';
import Styles from './MyVirtualizedTable.module.css';

// const list = [
//   {name: 'Brian Vaughn', description: 'Software engineer'},
// ];
const list = data[0];

class MyVirtualizedTable extends React.Component {

  render() {
    return (
      <AutoSizer>
      { (params) => {
        const {width, height} = params;
        //console.log('params:', params);
        return (
          <Table
            width={width}
            height={height}
            headerHeight={20}
            rowHeight={20}
            rowCount={list.length}
            rowGetter={({index}) => list[index]}
            rowClassName={Styles.rowStyle}
          >
            <Column width={200} label="Name" dataKey="name" />
            <Column width={50} label="Age" dataKey="age" />
            <Column width={100} label="Gender" dataKey="gender" />
            <Column width={200} label="Company" dataKey="company" />
          </Table>    
        )}
      }
      </AutoSizer>
    );
  }
}

export default MyVirtualizedTable;