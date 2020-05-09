import React from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Column, Table, SortDirection, SortIndicator} from 'react-virtualized';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import styles from './MyFeatureTable.module.css';
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
      useDynamicRowHeight: false,
      searchTerm: '',
    };

    this._getRowHeight = this._getRowHeight.bind(this);
    this._headerRenderer = this._headerRenderer.bind(this);
    this._noRowsRenderer = this._noRowsRenderer.bind(this);
    this._rowClassName = this._rowClassName.bind(this);
    this._sort = this._sort.bind(this);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let filteredList = list.filter(item => this.containsSearchText(item));
    let sortedList = this._sortList({
      filteredList, 
      sortBy: this.state.sortBy, 
      sortDirection: this.state.sortDirection
    });
    this.setState({ filteredList, sortedList  });
  };

  containsSearchText = (item) => {
    const searchText = this.state.searchText.toLowerCase();
    let found = false;
    Object.keys(item).forEach(function(key,index) {
      if (found) {
        return;
      }
      let val = item[key].toString().toLowerCase();
      if (val.includes(searchText)) {
        found = true;
        return;
      }
    });
    return found;
  }

  onSearchTextChanged = (event) => {
    this.setState({ searchText: event.target.value });
  }

  render() {
    const {
      disableHeader,
      headerHeight,
      height,
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
  
    const getCompanyCellRenderer = ({
      cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex
    }) => {
      const data = isScrolling ? '...' :
        rowData[dataKey];
      return (
        <div className={styles.divCompany}>
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
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">🔍</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="text"
                onChange={this.onSearchTextChanged} 
                placeholder="Enter Search Term" 
              />
              <Button type="submit">Search</Button>
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
              headerClassName={styles.headerColumn}
              headerHeight={headerHeight}
              height={height}
              noRowsRenderer={this._noRowsRenderer}
              overscanRowCount={overscanRowCount}
              rowClassName={this._rowClassName}
              rowHeight={useDynamicRowHeight ? this._getRowHeight : rowHeight}
              rowGetter={rowGetter}
              // rowGetter={({index}) => list[index]}
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
                width={120}
              />
              <Column
                width={210}
                disableSort
                label="This is my pretty company name"
                dataKey="company"
                className={styles.exampleColumn}
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
    return 20;
    //return this._getDatum(this.state.sortedList, index).length;
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
    return <div className={styles.noRows}>No rows</div>;
  }

  _rowClassName({index}) {
    if (index < 0) {
      return styles.headerRow;
    } else {
      return index % 2 === 0 ? styles.evenRow : styles.oddRow;
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
}