import React from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Column, Table, SortDirection, SortIndicator, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Styles from './MyFeatureTable.module.css';
import data from '../data.json';

let list = data[0];

export default class MyFeatureTable extends React.PureComponent {
  // static propTypes = {
  //   list: PropTypes.instanceOf(Immutable.List).isRequired,
  //   width: PropTypes.number.isRequired,
  // };

  _cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 25,
  });

  _lastRenderedWidth = this.props.width;

  render() {
    const width = 400;

    if (this._lastRenderedWidth !== this.props.width) {
      this._lastRenderedWidth = this.props.width;
      this._cache.clearAll();
    }

    return (
      <Table
        deferredMeasurementCache={this._cache}
        headerHeight={20}
        height={400}
        overscanRowCount={2}
        rowClassName={Styles.tableRow}
        rowHeight={this._cache.rowHeight}
        rowGetter={this._rowGetter}
        rowCount={list.length}
        width={width}>
        <Column
          className={Styles.tableColumn}
          dataKey="name"
          label="Name"
          width={125}
        />
        <Column
          className={Styles.tableColumn}
          dataKey="color"
          label="Color"
          width={75}
        />
        <Column
          width={width - 200}
          dataKey="random"
          label="Dynamic text"
          cellRenderer={this._columnCellRenderer}
        />
      </Table>
    );
  }

  _columnCellRenderer = ({dataKey, parent, rowIndex}) => {

    const datum = list[rowIndex % list.length];
    //console.log('_columnCellRenderer', rowIndex, datum);
    const content = rowIndex % 5 === 0 ? '' : datum.name;

    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}>
        <div
          className={Styles.tableColumn}
          style={{
            whiteSpace: 'normal',
          }}>
          {content}
        </div>
      </CellMeasurer>
    );
  };

  _rowGetter = ({index}) => {
    return list[index];
  };
}







































// import React from 'react';
// import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
// import { Column, Table, SortDirection, SortIndicator, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
// import Form from 'react-bootstrap/Form';
// import InputGroup from 'react-bootstrap/InputGroup';
// import Styles from './MyFeatureTable.module.css';
// import data from '../data.json';

// let list = data[0];

// const NAME_LEN_BORDER = 15;

// export default class MyFeatureTable extends React.PureComponent {
//   myCache = new CellMeasurerCache({
//     fixedWidth: true,
//     minHeight: 20
//   });

//   myLastRenderedWidth = this.props.width;

//   constructor(props, context) {
//     super(props, context);

//     const sortBy = 'index';
//     const sortDirection = SortDirection.ASC;
//     const filteredList = list;
//     const sortedList = this.sortList({filteredList, sortBy, sortDirection});

//     this.state = {
//       disableHeader: false,
//       headerHeight: 30,
//       height: 270,
//       width: 500,
//       hideIndexRow: false,
//       overscanRowCount: 10,
//       scrollToIndex: undefined,
//       sortBy,
//       sortDirection,
//       sortedList,
//       filteredList,
//       searchTerm: '',
//     };

//     this._headerRenderer = this._headerRenderer.bind(this);
//     this._noRowsRenderer = this._noRowsRenderer.bind(this);
//     this._rowClassName = this._rowClassName.bind(this);
//   }

//   render() {
//     const {
//       width,
//       disableHeader,
//       headerHeight,
//       hideIndexRow,
//       overscanRowCount,
//       scrollToIndex,
//       sortBy,
//       sortDirection,
//       filteredList,
//       sortedList,
//     } = this.state;

//     const rowGetter = ({index}) => {
//       return this._getItem(sortedList, index);
//     }
  
//     const getIndexCellData = ({rowData}) => {
//       //console.log('getIndexCellData-params:', rowData);
//       return rowData.index;
//     }

//     // const getRowHeight123 = (list, index) => {
//     //   let item = this._getItem(list, index);
//     //   let rowHeight = getRowHeightFromItem(item);      
//     //   if (index <= 10) {
//     //     console.log('getRowHeight-index:', rowHeight, index, item);
//     //   }
//     //   return rowHeight;
//     // }

//     // const getRowHeightFromItem = (item) => {      
//     //   if (item.name.length > NAME_LEN_BORDER) {
//     //     return 40;
//     //   }
//     //   return 20;
//     // }

//     const getNameCellRenderer = (params) => {
//       const { parent, dataKey, isScrolling, rowData, columnIndex, 
//         rowIndex /*, cellData, columnData, */ } = params;
//       let value = rowData[dataKey];
//       let data = null;
//       if (isScrolling) {
//         data = ['...'];
//       } else if (value.length <= NAME_LEN_BORDER) {
//         data = [value];
//       } else {
//         data = value.split(' ');
//       }
        
//       //console.log('getNameCellRenderer', rowIndex, columnIndex, dataKey, parent);
//       return (
//         <CellMeasurer
//             cache={this.myCache}
//             columnIndex={columnIndex}
//             key={dataKey}
//             parent={parent}
//             rowIndex={rowIndex}>
//           <div className={Styles.divName}>
//           {
//             data.map((v,k) => (
//               <div key={k}>{v}</div>
//             ))
//           }
//           </div>
//         </CellMeasurer>
//       );
//     }
    
//     const getCompanyCellRenderer = (params) => {
//       const { parent, columnIndex, dataKey, isScrolling, 
//         rowData, rowIndex /* cellData, columnData */ } = params;
//       // const rowHeight = getRowHeightFromItem(rowData);
//       //console.log('getCompanyCellRenderer', rowHeight, rowData);
//       const data = isScrolling ? '...' : rowData[dataKey];
//       return (
//         <div className={Styles.divCompany}>
//           {data}
//         </div>
//       );
//     }

//     const sort = ({sortBy, sortDirection}) => {
//       let sortedList = this.sortList({filteredList, sortBy, sortDirection});
//       //console.log('_getRowHeight', sortedList);
  
//       this.setState({sortBy, sortDirection, sortedList});
//     }

//     if (this.myLastRenderedWidth !== width) {
//       this.myLastRenderedWidth = width;
//       this.myCache.clearAll();
//     }

//     return (
//       <>
//       <Form onSubmit={this.handleSubmit}>
//         <Form.Row>
//           <Form.Group controlId="searchText">
//             <InputGroup>
//               <InputGroup.Prepend style={{height: '25px'}}>
//                 <InputGroup.Text id="inputGroupPrepend"><span role="img" aria-label="search">🔍</span></InputGroup.Text>
//               </InputGroup.Prepend>
//               <Form.Control type="text"
//                 onChange={this.onSearchTextChanged} 
//                 placeholder="Enter Search Term" 
//                 style={{height: '25px', fontSize: '15px', marginRight: '3px'}}
//               />
//             </InputGroup>
//           </Form.Group>
//         </Form.Row>
//       </Form>
//       {/* <AutoSizer>
//         { (params) => {
//           const {width, height} = params;
//           //console.log('AutoSizer:');

//           if (this.myLastRenderedWidth !== width) {
//             this.myLastRenderedWidth = width;
//             this.myCache.clearAll();
//           } 
//           return (*/}
//             <Table
//               deferredMeasurementCache={this.myCache}
//               headerHeight={20}
//               height={400}
//               overscanRowCount={2}
//               rowClassName={Styles.tableRow}
//               rowHeight={params => {
//                 const {index} = params;
//                 let h = this.myCache.rowHeight(params);
//                 console.log('Table', index, h);
//                 return h;
//               }}
//               rowGetter={rowGetter}
//               rowCount={1000}
//               width={width}
//               // deferredMeasurementCache={this.myCache}
//               // disableHeader={disableHeader}
//               // headerClassName={Styles.headerColumn}
//               // headerHeight={headerHeight}
//               // height={height}
//               // noRowsRenderer={this._noRowsRenderer}
//               // overscanRowCount={overscanRowCount}
//               // rowClassName={this._rowClassName}
//               // rowHeight={this.myCache.rowHeight}
//               // rowGetter={rowGetter}
//               // rowCount={sortedList.length}
//               // scrollToIndex={scrollToIndex}
//               // sort={sort}
//               // sortBy={sortBy}
//               // sortDirection={sortDirection}
//               // width={width}
//             >
//               {!hideIndexRow && (
//                 <Column
//                   label="Index"
//                   dataKey="index"
//                   disableSort={!this._isSortEnabled()}
//                   headerRenderer={this._headerRenderer}
//                   cellDataGetter={getIndexCellData}
//                   width={80}
//                 />
//               )}
//               <Column
//                 label="Full Name"
//                 dataKey="name"
//                 disableSort={!this._isSortEnabled()}
//                 headerRenderer={this._headerRenderer}
//                 cellRenderer={getNameCellRenderer}
//                 width={120}
//               />
//               {/* <Column
//                 width={width-200}
//                 disableSort
//                 label="This is my pretty company name"
//                 dataKey="company"
//                 className={Styles.exampleColumn}
//                 cellRenderer={getCompanyCellRenderer}
//                 flexGrow={1}
//               /> */}
//             </Table>
//           {/* )}
//         }
//       </AutoSizer> */}
//       </>
//     );
//   }

//   _getItem(list, index) {
//     return list[index];
//   }

//   _headerRenderer(params) {
//     //console.log('_headerRenderer:', params);
//     const { label, dataKey, sortBy, sortDirection} = params;
//     return (
//       <div>
//         {label}
//         {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
//       </div>
//     );
//   }

//   _isSortEnabled() {
//     return true;
//   }

//   _noRowsRenderer() {
//     return <div className={Styles.noRows}>No rows</div>;
//   }

//   _rowClassName({index}) {
//     if (index < 0) {
//       return Styles.headerRow;
//     } else {
//       return index % 2 === 0 ? Styles.evenRow : Styles.oddRow;
//     }
//   }

//   _updateUseDynamicRowHeight(value) {
//     this.setState({
//       useDynamicRowHeight: value,
//     });
//   }

//   handleSubmit = (event) => {
//     event.preventDefault();
//   };

//   containsSearchText = (item, aSearchText) => {
//     if (aSearchText == null) {
//       return true;
//     }
//     const searchText = aSearchText.toLowerCase();
//     let found = false;
//     Object.keys(item).forEach(function(key,index) {
//       if (found || key === '_id') {
//         return;
//       }
//       let val = item[key].toString().toLowerCase();
//       if (val.includes(searchText)) {
//         console.log('val:', val, searchText, item);
//         found = true;
//         return;
//       }
//     });
//     return found;
//   }

//   onSearchTextChanged = (event) => {
//     const searchText = event.target.value;
//     let filteredList = list.filter(item => this.containsSearchText(item, searchText));
//     let sortedList = this._sortList({
//       filteredList, 
//       sortBy: this.state.sortBy, 
//       sortDirection: this.state.sortDirection
//     });
//     this.setState({ filteredList, sortedList  });
//   }

//   sortList = ({filteredList, sortBy, sortDirection}) => {
//     let newList = filteredList.sort((a, b) => {      
//       let dir = sortDirection === SortDirection.ASC ? 1 : -1;
//       if (a[sortBy] > b[sortBy]) {
//         return 1 * dir;
//       } else if (a[sortBy] < b[sortBy]) {
//         return -1 * dir;
//       }
//       return 0;      
//     });
//     return newList;
//   }
// }