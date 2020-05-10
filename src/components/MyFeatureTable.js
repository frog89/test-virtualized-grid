import React from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Column, Table, SortDirection, SortIndicator } from 'react-virtualized';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Styles from './MyFeatureTable.module.css';
import data from '../data.json';

let list = data[0];

export default class MyFeatureTable extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    const sortBy = 'index';
    const sortDirection = SortDirection.ASC;
    const filteredList = list;
    const sortedList = this._sortList({filteredList, sortBy, sortDirection});

    this.state = {
      disableHeader: false,
      headerHeight: 30,
      height: 270,
      hideIndexRow: false,
      overscanRowCount: 10,
      rowHeight: 20,
      scrollToIndex: undefined,
      sortBy,
      sortDirection,
      sortedList,
      filteredList,
      useDynamicRowHeight: true,
      searchTerm: '',
    };

    this._getRowHeight = this._getRowHeight.bind(this);
    this._headerRenderer = this._headerRenderer.bind(this);
    this._noRowsRenderer = this._noRowsRenderer.bind(this);
    this._rowClassName = this._rowClassName.bind(this);
    this._sort = this._sort.bind(this);
  }

  render() {
    const {
      disableHeader,
      headerHeight,
      hideIndexRow,
      overscanRowCount,
      rowHeight,
      scrollToIndex,
      sortBy,
      sortDirection,
      sortedList,
      useDynamicRowHeight,
    } = this.state;

    const rowGetter = ({index}) => {
      return this._getDatum(sortedList, index);
    }
  
    const getIndexCellData = ({rowData}) => {
      //console.log('getIndexCellData-params:', rowData);
      return rowData.index;
    }

    const getNameCellRenderer = (params) => {
      const { dataKey, isScrolling, rowData /*, rowIndex, cellData, columnData, columnIndex*/ } = params;
      let value = rowData[dataKey];
      let data = null;
      if (isScrolling) {
        data = ['...'];
      } else if (value.length <= 15) {
        data = [value];
      } else {
        data = value.split(' ');
      }
        
      return (
        <div className={Styles.divName}>
          {
            data.map((v,k) => (
              <div key={k}>{v}</div>
            ))
          }
        </div>
      );
    }
    
    const getCompanyCellRenderer = ({
      cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex
    }) => {
      const rowHeight = this._getRowHeight({ index: rowIndex});
      const data = isScrolling ? '...' :
        rowData[dataKey];
      return (
        <div className={Styles.divCompany} style={{ height: rowHeight-6}}>
          {data}
        </div>
      );
    }
  
    return (
      <>
      <Form onSubmit={this.handleSubmit}>
        <Form.Row>
          <Form.Group controlId="searchText">
            <InputGroup>
              <InputGroup.Prepend style={{height: '25px'}}>
                <InputGroup.Text id="inputGroupPrepend"><span role="img" aria-label="search">🔍</span></InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="text"
                onChange={this.onSearchTextChanged} 
                placeholder="Enter Search Term" 
                style={{height: '25px', fontSize: '15px', marginRight: '3px'}}
              />
            </InputGroup>
          </Form.Group>
        </Form.Row>
      </Form>
      <AutoSizer>
        { (params) => {
          const {width, height} = params;
          //console.log('params:', params);
          return (
            <Table
              disableHeader={disableHeader}
              headerClassName={Styles.headerColumn}
              headerHeight={headerHeight}
              height={height}
              noRowsRenderer={this._noRowsRenderer}
              overscanRowCount={overscanRowCount}
              rowClassName={this._rowClassName}
              rowHeight={useDynamicRowHeight ? this._getRowHeight : rowHeight}
              rowGetter={rowGetter}
              rowCount={this.state.sortedList.length}
              scrollToIndex={scrollToIndex}
              sort={this._sort}
              sortBy={sortBy}
              sortDirection={sortDirection}
              width={width}
            >
              {!hideIndexRow && (
                <Column
                  label="Index"
                  dataKey="index"
                  disableSort={!this._isSortEnabled()}
                  headerRenderer={this._headerRenderer}
                  cellDataGetter={getIndexCellData}
                  width={80}
                />
              )}
              <Column
                label="Full Name"
                dataKey="name"
                disableSort={!this._isSortEnabled()}
                headerRenderer={this._headerRenderer}
                cellRenderer={getNameCellRenderer}
                width={120}
              />
              <Column
                width={210}
                disableSort
                label="This is my pretty company name"
                dataKey="company"
                className={Styles.exampleColumn}
                cellRenderer={getCompanyCellRenderer}
                flexGrow={1}
              />
            </Table>
          )}
        }
        </AutoSizer>
        </>
      );
  }

  _getDatum(list, index) {
    return this.state.sortedList[index % this.state.sortedList.length];
  }

  _getRowHeight({index}) {
    let cellValue = this._getDatum(this.state.sortedList, index);
    if (cellValue.name.length > 15) {
      return 40;
    }
    return 20;
  }

  _headerRenderer(params) {
    //console.log('_headerRenderer:', params);
    const { label, dataKey, sortBy, sortDirection} = params;
    return (
      <div>
        {label}
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
      </div>
    );
  }

  _isSortEnabled() {
    return true;
  }

  _noRowsRenderer() {
    return <div className={Styles.noRows}>No rows</div>;
  }

  _rowClassName({index}) {
    if (index < 0) {
      return Styles.headerRow;
    } else {
      return index % 2 === 0 ? Styles.evenRow : Styles.oddRow;
    }
  }

  _sort({sortBy, sortDirection}) {
    const sortedList = this._sortList({filteredList: this.state.filteredList, sortBy, sortDirection});

    this.setState({sortBy, sortDirection, sortedList});
  }

  _sortList({filteredList, sortBy, sortDirection}) {
    let newList = filteredList.sort((a, b) => {      
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

  _updateUseDynamicRowHeight(value) {
    this.setState({
      useDynamicRowHeight: value,
    });
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
      if (found || key === '_id') {
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

  onSearchTextChanged = (event) => {
    const searchText = event.target.value;
    let filteredList = list.filter(item => this.containsSearchText(item, searchText));
    let sortedList = this._sortList({
      filteredList, 
      sortBy: this.state.sortBy, 
      sortDirection: this.state.sortDirection
    });
    this.setState({ filteredList, sortedList  });
  }
}