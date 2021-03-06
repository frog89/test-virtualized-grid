import React from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Column, Table, SortDirection, SortIndicator, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Styles from './MyFeatureTable.module.css';
import data from '../data.json';

let list = data[0];

const NAME_LEN_BORDER = 15;

export default class MyFeatureTable extends React.PureComponent {
  myCache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 20
  });

  myLastRenderedWidth = this.props.width;

  constructor(props, context) {
    super(props, context);

    const sortBy = 'index';
    const sortDirection = SortDirection.ASC;
    const filteredList = list;
    const sortedList = this.sortList({ list: filteredList, sortBy, sortDirection});

    this.state = {
      disableHeader: false,
      headerHeight: 30,
      height: 270,
      width: 500,
      overscanRowCount: 10,
      scrollToIndex: undefined,
      sortBy,
      sortDirection,
      sortedList,
      filteredList,
      searchTerm: '',
    };
  }

  render() {
    const {
      width,
      disableHeader,
      headerHeight,
      overscanRowCount,
      scrollToIndex,
      sortBy,
      sortDirection,
      sortedList,
    } = this.state;
  
    if (this.myLastRenderedWidth !== width) {
      this.myLastRenderedWidth = width;
      this.myCache.clearAll();
    }

    return (
      <>
      <Form onSubmit={this.handleSubmit}>
        <Form.Row>
          <Form.Group controlId="searchText" style={{width: '100%', paddingLeft: '5px' , paddingRight: '5px'}}>
            <InputGroup>
              <InputGroup.Prepend style={{height: '25px'}}>
                <InputGroup.Text id="inputGroupPrepend"><span role="img" aria-label="search">🔍</span></InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="text"
                onChange={this.onFilterTextChanged} 
                placeholder="Enter Search Term" 
                style={{height: '25px', width: '100%', fontSize: '15px', marginRight: '3px'}}
              />
            </InputGroup>
          </Form.Group>
        </Form.Row>
      </Form>
      <AutoSizer>
        { (params) => {
          const {width, height} = params;
          //console.log('AutoSizer:');

          if (this.myLastRenderedWidth !== width) {
            this.myLastRenderedWidth = width;
            this.myCache.clearAll();
          } 
          return (
            <Table
              deferredMeasurementCache={this.myCache}
              disableHeader={disableHeader}
              headerClassName={Styles.headerColumn}
              headerHeight={headerHeight}
              height={height}
              noRowsRenderer={this.noRowsRenderer}
              overscanRowCount={overscanRowCount}
              rowClassName={this.rowClassName}
              rowHeight={params => {
                const {index} = params;
                let h = this.myCache.rowHeight(params);
                console.log('Table', index, h);
                return h;
              }}
              rowGetter={this.rowGetter}
              rowCount={sortedList.length}
              scrollToIndex={scrollToIndex}
              sort={this.sort}
              sortBy={sortBy}
              sortDirection={sortDirection}
              width={width}
            >
              <Column
                label="Index"
                dataKey="index"
                disableSort={!this.isSortEnabled()}
                headerRenderer={this.headerRenderer}
                cellDataGetter={this.getIndexCellData}
                width={80}
              />
              <Column
                label="Full Name"
                dataKey="name"
                disableSort={!this.isSortEnabled()}
                headerRenderer={this.headerRenderer}
                cellRenderer={this.getNameCellRenderer}
                width={120}
              />
              <Column
                width={width-200}
                disableSort
                label="This is my pretty company name"
                dataKey="company"
                className={Styles.exampleColumn}
                cellRenderer={this.getCompanyCellRenderer}
                flexGrow={1}
              />
            </Table>
          )}
        }
      </AutoSizer>
      </>
    );
  }

  sort = ({sortBy, sortDirection}) => {
    let sortedList = this.sortList({ list: this.state.filteredList, sortBy, sortDirection});
    //console.log('_getRowHeight', sortedList);

    this.setState({sortBy, sortDirection, sortedList});
  }

  getNameCellRenderer = (params) => {
    //const { parent, dataKey, isScrolling, rowData, columnIndex, rowIndex, cellData, columnData } = params;
    const { parent, dataKey, rowData, rowIndex } = params;
    let value = rowData[dataKey];
    let data = null;
    if (value.length <= NAME_LEN_BORDER) {
      data = [value];
    } else {
      data = value.split(' ');
    }
      
    //console.log('getNameCellRenderer', rowIndex, columnIndex, dataKey, parent);
    return (
      <CellMeasurer
          cache={this.myCache}
          columnIndex={0}
          key={dataKey}
          parent={parent}
          rowIndex={rowIndex}>
        <div className={Styles.divName}>
        {
          data.map((v,k) => (
            <div key={k}>{v}</div>
          ))
        }
        </div>
      </CellMeasurer>
    );
  }
  
  getCompanyCellRenderer = (params) => {
    //const { parent, dataKey, isScrolling, rowData, columnIndex, rowIndex, cellData, columnData } = params;
    const { parent, dataKey, rowData, rowIndex } = params;
    const rowHeight = this.myCache.rowHeight({index: rowIndex});
    //console.log('getCompanyCellRenderer', rowHeight, rowData);
    let data = [];
    if (rowIndex % 5 === 0) {
      data = ['This', 'is', 'a', 'long', 'company','name'];
    } else {
      data = [ rowData.company ];
    }

    return (
      <CellMeasurer
        cache={this.myCache}
        columnIndex={1}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}
      >
        <div style={{ minHeight: rowHeight }}>
          <div className={Styles.divCompany} style={{ minHeight: rowHeight-2 }}>
          {
            data.map((v,k) => (
              <div key={k}>{v}</div>
            ))
          }
          </div>
        </div>
      </CellMeasurer>
    );
  }

  rowGetter = ({index}) => {
    return this.getItem(this.state.sortedList, index);
  }

  getIndexCellData = ({rowData}) => {
    //console.log('getIndexCellData-params:', rowData);
    return rowData.index;
  }

  getItem(list, index) {
    return list[index];
  }

  headerRenderer(params) {
    //console.log('_headerRenderer:', params);
    const { label, dataKey, sortBy, sortDirection} = params;
    return (
      <div>
        {label}
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
      </div>
    );
  }

  isSortEnabled() {
    return true;
  }

  noRowsRenderer() {
    return <div className={Styles.noRows}>No rows</div>;
  }

  rowClassName({index}) {
    if (index < 0) {
      return Styles.headerRow;
    } else {
      return index % 2 === 0 ? Styles.evenRow : Styles.oddRow;
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
  };

  containsSearchText = (item, aSearchText) => {
    if (aSearchText == null) {
      return true;
    }
    const searchText = aSearchText.toLowerCase();
    let found = false;
    Object.keys(item).forEach(function(key,index) {
      if (found || (key !== 'index' && key !== 'name' && key !== 'company')) {
        return;
      }
      let val = item[key].toString().toLowerCase();
      if (val.includes(searchText)) {
        console.log('val:', val, searchText, item);
        found = true;
        return;
      }
    });
    return found;
  }

  onFilterTextChanged = (event) => {
    const filterText = event.target.value;
    let filteredList = list.filter(item => this.containsSearchText(item, filterText));
    let sortedList = this.sortList({
      list: filteredList, 
      sortBy: this.state.sortBy, 
      sortDirection: this.state.sortDirection
    });
    this.setState({ filteredList, sortedList  });
  }

  sortList = ({ list, sortBy, sortDirection}) => {
    let newList = list.sort((a, b) => {      
      let dir = sortDirection === SortDirection.ASC ? 1 : -1;
      if (a[sortBy] > b[sortBy]) {
        return 1 * dir;
      } else if (a[sortBy] < b[sortBy]) {
        return -1 * dir;
      }
      return 0;      
    });
    return newList;
  }
}